import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, items } = body;

    // 1. Validações básicas de entrada
    if (!customerName || typeof customerName !== "string" || customerName.trim().length === 0) {
      return NextResponse.json({ error: "Nome do cliente inválido." }, { status: 400 });
    }
    if (!customerEmail || typeof customerEmail !== "string" || !customerEmail.includes("@")) {
      return NextResponse.json({ error: "Email do cliente inválido." }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "A sacola está vazia ou os itens são inválidos." }, { status: 400 });
    }

    // Validar formato de cada item na sacola
    for (const item of items) {
      if (!item.variantId || typeof item.variantId !== "string" || !item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json({ error: "Item da sacola com dados ou quantidades inválidos." }, { status: 400 });
      }
    }

    // 2. Transação para reserva de estoque e criação do pedido
    const order = await prisma.$transaction(async (tx) => {
      // Evitar duplicidade nos itens enviados e agrupar quantidades se houver
      const groupedItemsMap = new Map<string, number>();
      for (const item of items) {
        const qty = groupedItemsMap.get(item.variantId) || 0;
        groupedItemsMap.set(item.variantId, qty + item.quantity);
      }

      // Ordenar os IDs das variantes de forma alfanumérica para garantir ordem consistente de bloqueio e evitar deadlocks
      const sortedVariantIds = Array.from(groupedItemsMap.keys()).sort((a, b) => a.localeCompare(b));

      const orderItemsData = [];
      let totalAmount = 0;

      for (const variantId of sortedVariantIds) {
        const quantityToReserve = groupedItemsMap.get(variantId)!;

        // Bloqueio de linha (FOR UPDATE) no PostgreSQL via raw query
        const lockedVariants: any[] = await tx.$queryRaw`
          SELECT id, quantity, product_id, size, color 
          FROM "stock_variants" 
          WHERE id = ${variantId}::uuid 
          FOR UPDATE
        `;

        const variant = lockedVariants[0];
        if (!variant) {
          throw new Error(`Variante com ID ${variantId} não encontrada no catálogo.`);
        }

        // Verificar disponibilidade física de estoque
        if (variant.quantity < quantityToReserve) {
          throw new Error(`Estoque insuficiente para a peça ${variant.color} no tamanho ${variant.size}. Disponível: ${variant.quantity}, Solicitado: ${quantityToReserve}`);
        }

        // Buscar o preço atual e informações do produto associado
        const product = await tx.product.findUnique({
          where: { id: variant.product_id },
          select: { price: true, name: true }
        });

        if (!product) {
          throw new Error(`Produto associado à variante não encontrado.`);
        }

        const price = Number(product.price);
        const subtotal = price * quantityToReserve;
        totalAmount += subtotal;

        // Deduzir estoque físico do produto
        await tx.stockVariant.update({
          where: { id: variantId },
          data: {
            quantity: {
              decrement: quantityToReserve
            }
          }
        });

        orderItemsData.push({
          variant_id: variantId,
          quantity: quantityToReserve,
          unit_price: price
        });
      }

      // Criar o pedido (Order) e itens de pedido (OrderItem) no banco
      const newOrder = await tx.order.create({
        data: {
          status: "pending",
          customer_name: customerName,
          customer_email: customerEmail,
          total_amount: totalAmount,
          items: {
            create: orderItemsData
          }
        }
      });

      return newOrder;
    }, {
      timeout: 10000, // Timeout de 10 segundos
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      totalAmount: Number(order.total_amount),
      status: order.status
    });

  } catch (error: any) {
    console.error("Erro ao realizar checkout:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Erro desconhecido ao processar o checkout."
    }, { status: 500 });
  }
}
