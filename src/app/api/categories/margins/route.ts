import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_CATEGORY_MARGINS, ensureDefaultMarginRules, calculateTargetPrice } from "@/lib/pricingEngine";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    let rules = await prisma.categoryMarginRule.findMany({
      orderBy: { category_label: "asc" }
    });

    if (rules.length === 0) {
      await ensureDefaultMarginRules();
      rules = await prisma.categoryMarginRule.findMany({
        orderBy: { category_label: "asc" }
      });
    }

    return NextResponse.json({ success: true, rules });
  } catch (error: any) {
    console.error("Erro ao buscar regras de margem:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category_code, target_margin_percent, drop_indexing_mode, reindex_products } = body;

    if (!category_code || target_margin_percent === undefined) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 });
    }

    const updatedRule = await prisma.categoryMarginRule.upsert({
      where: { category_code },
      update: {
        target_margin_percent: new Prisma.Decimal(target_margin_percent),
        drop_indexing_mode: drop_indexing_mode || "INDEXED"
      },
      create: {
        category_code,
        category_label: category_code,
        target_margin_percent: new Prisma.Decimal(target_margin_percent),
        drop_indexing_mode: drop_indexing_mode || "INDEXED"
      }
    });

    let affectedProductsCount = 0;

    // Se solicitado reindexar os produtos vinculados a esta categoria
    if (reindex_products) {
      const products = await prisma.product.findMany({
        where: {
          product_category: category_code,
          is_price_indexed: true,
          cost_price: { not: null }
        }
      });

      for (const prod of products) {
        if (prod.cost_price) {
          const cost = Number(prod.cost_price);
          const newPrice = calculateTargetPrice(cost, Number(target_margin_percent));
          await prisma.product.update({
            where: { id: prod.id },
            data: {
              price: new Prisma.Decimal(newPrice),
              target_margin_percent: new Prisma.Decimal(target_margin_percent)
            }
          });
          affectedProductsCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      rule: updatedRule,
      affectedProductsCount
    });
  } catch (error: any) {
    console.error("Erro ao atualizar regra de margem:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
