import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Obter o corpo bruto da requisição para verificar a assinatura de forma íntegra
    const bodyText = await request.text();
    const signatureHeader = request.headers.get("x-signature") || "";

    // 2. Computar a assinatura esperada com HMAC SHA-256 e a chave secreta
    const secret = process.env.PAYMENT_WEBHOOK_SECRET || "super_secret_webhook_key";
    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    // 3. Comparação de tempo seguro (timingSafeEqual) contra timing attacks
    const signatureBuffer = Buffer.from(signatureHeader, "utf-8");
    const computedBuffer = Buffer.from(computedSignature, "utf-8");

    if (
      signatureBuffer.length !== computedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, computedBuffer)
    ) {
      console.warn("Assinatura do webhook inválida. Acesso negado.");
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    // 4. Parsear o payload verificado
    const payload = JSON.parse(bodyText);
    const { orderId, status } = payload;

    if (!orderId || typeof orderId !== "string" || !status || typeof status !== "string") {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    // 5. Verificar a existência do pedido
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido não encontrado no banco." }, { status: 404 });
    }

    // 6. Garantir idempotência: Se o pedido já foi pago ou falhou, ignoramos alterações adicionais
    if (order.status === "paid" || order.status === "failed") {
      return NextResponse.json({
        success: true,
        message: `O pedido já possui o status finalizado: ${order.status}. Nenhuma alteração feita.`,
        idempotent: true
      });
    }

    // 7. Processamento e alteração de status
    if (status === "paid") {
      // Atualizar para pago
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "paid"
        }
      });

      return NextResponse.json({
        success: true,
        message: "Status do pedido atualizado para pago (paid) com sucesso."
      });
    } else if (status === "failed" || status === "cancelled") {
      // Se falhou, estornar estoque de todas as variantes e mudar status do pedido
      await prisma.$transaction(async (tx) => {
        const orderItems = await tx.orderItem.findMany({
          where: { order_id: orderId }
        });

        // Devolver cada quantidade ao estoque original
        for (const item of orderItems) {
          await tx.stockVariant.update({
            where: { id: item.variant_id },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          });
        }

        // Atualizar status do pedido para failed
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: "failed"
          }
        });
      });

      return NextResponse.json({
        success: true,
        message: "Pedido cancelado por falha no pagamento. Estoque estornado."
      });
    }

    return NextResponse.json({
      success: false,
      error: `Status de pagamento '${status}' não suportado.`
    }, { status: 400 });

  } catch (error: any) {
    console.error("Erro ao processar Webhook de Pagamento:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Erro interno ao processar o webhook."
    }, { status: 500 });
  }
}
