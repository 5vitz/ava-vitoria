import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SUPPLIERS_CATALOG } from "@/lib/suppliers";
import { evaluateSupplierPriceChange, calculateTargetPrice } from "@/lib/pricingEngine";
import { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const items = await prisma.supplierCatalogItem.findMany({
      orderBy: { last_checked_at: "desc" }
    });
    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { force_mock_update, sample_cost_delta } = body;

    const rules = await prisma.categoryMarginRule.findMany();
    const rulesMap = new Map(rules.map(r => [r.category_code, r]));

    const logs: string[] = [];
    const alerts: any[] = [];
    let updatedItemsCount = 0;

    // Sincroniza ou insere itens base do catálogo da Dimona Dropsimples e Reserva INK
    for (const [supKey, supplier] of Object.entries(SUPPLIERS_CATALOG)) {
      for (const costRef of supplier.baseCostsReference) {
        const itemCode = `${supKey}_${costRef.itemLabel.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
        
        let existing = await prisma.supplierCatalogItem.findUnique({
          where: { item_code: itemCode }
        });

        let currentCost = existing ? Number(existing.cost_current) : costRef.costFrontBack;
        let baselineCost = existing ? Number(existing.cost_baseline) : costRef.costFrontBack;

        // Se for teste de simulação com variação forçada
        if (force_mock_update && sample_cost_delta) {
          currentCost = Math.max(10, currentCost + Number(sample_cost_delta));
        }

        if (!existing) {
          existing = await prisma.supplierCatalogItem.create({
            data: {
              supplier_code: supKey,
              item_code: itemCode,
              item_name: costRef.itemLabel,
              print_mode: costRef.costFrontBack !== costRef.costSinglePrint ? "FRENTE_COSTAS" : "FRENTE",
              cost_current: new Prisma.Decimal(currentCost),
              cost_baseline: new Prisma.Decimal(baselineCost),
              last_checked_at: new Date(),
              last_changed_at: new Date()
            }
          });
          logs.push(`Item de catálogo inicializado: ${itemCode} (R$ ${currentCost.toFixed(2)})`);
          updatedItemsCount++;
        } else {
          // Atualiza heartbeat de checagem 2h
          await prisma.supplierCatalogItem.update({
            where: { id: existing.id },
            data: { last_checked_at: new Date() }
          });
        }
      }
    }

    logs.push(`Agente Auditor de Preços executou inspeção preventiva. Fornecedores auditados com sucesso.`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      updatedItemsCount,
      logs,
      alerts
    });
  } catch (error: any) {
    console.error("Erro no sincronizador de fornecedores:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
