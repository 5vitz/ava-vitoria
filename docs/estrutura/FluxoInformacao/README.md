# ⚡ O Fluxo de Informação da AVA Vitória (APIs & Integrações)

Esta camada define os contratos de API, a estrutura do catálogo do Instagram Shopping e as regras de segurança e resiliência dos webhooks de pagamento.

---

## 1. Mapeamento de Endpoints da API (Next.js App Router)

A tabela abaixo define os endpoints principais que o backend do Next.js deve expor.

| Endpoint | Método | Descrição | Payload de Entrada (JSON) | Resposta (JSON/XML) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/checkout` | `POST` | Processa o carrinho, reserva estoque e gera o PIX/Cartão no gateway | `{ items: [{ variantId, qty }], customer: { email, name, cpf } }` | `{ orderId: "UUID", payment_url: "...", pix_qr_code: "...", pix_copia_cola: "..." }` |
| `/api/webhooks/payment` | `POST` | Recebe a confirmação de pagamento enviada pelo gateway | *(Enviado pelo Gateway de Pagamento)* | `200 OK` (Com corpo vazio ou confirmação de recebimento) |
| `/api/catalog/meta` | `GET` | Endpoint público para sincronização da Sacolinha do Instagram | *(Nenhum)* | `application/xml` (Feed XML completo no padrão Meta) |
| `/api/design-tokens` | `GET` | Retorna as variáveis CSS ativas no banco de dados (Camada 1) | *(Nenhum)* | `{ theme: "dark", colors: { bg, accent... }, fonts: {...} }` |
| `/api/admin/instagram/publish` | `POST` | Dispara ou agenda publicação de carrossel no Instagram via Meta Graph API | `{ productId, caption, publishNow: boolean, scheduledTime?: string }` | `{ success: true, igMediaId: "...", scheduledTime?: "..." }` |

---

## 2. Endpoint do Instagram Shopping (`/api/catalog/meta`)

Este endpoint deve retornar um arquivo XML no formato **RSS 2.0** com o namespace da Meta (`xmlns:g="http://base.google.com/ns/1.0"`).

### 2.1. Exemplo de Estrutura XML de Saída:
```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AVA Vitoria - Streetwear de Luxo</title>
    <link>https://avavitoria.com.br</link>
    <description>Catálogo de streetwear de luxo inspirado na cultura urbana de Vitória.</description>
    
    <!-- Repete-se para cada produto e variante de tamanho/cor -->
    <item>
      <g:id>MOLETOM-OVER-PRETO-M</g:id>
      <g:title>Moletom Oversized AVA - Preto (M)</g:title>
      <g:description>Moletom oversized em algodão de alta gramatura, caimento streetwear estruturado.</g:description>
      <g:link>https://avavitoria.com.br/produtos/moletom-oversized-preto?size=M</g:link>
      <g:image_link>https://cdn.avavitoria.com.br/moletom-over-preto-capa.jpg</g:image_link>
      <g:additional_image_link>https://cdn.avavitoria.com.br/moletom-over-preto-costas.jpg</g:additional_image_link>
      <g:additional_image_link>https://cdn.avavitoria.com.br/moletom-over-preto-detalhe.jpg</g:additional_image_link>
      <g:availability>in stock</g:availability>
      <g:price>349.90 BRL</g:price>
      <g:brand>AVA Vitória</g:brand>
      <g:condition>new</g:condition>
      <g:size>M</g:size>
      <g:color>Preto</g:color>
    </item>
  </channel>
</rss>
```

---

## 3. Segurança e Resiliência do Webhook de Pagamento (`/api/webhooks/payment`)

Os webhooks são pontos de entrada públicos expostos à internet, o que os torna alvos de tentativas de invasão (como simulação de pagamentos falsos).

### 3.1. Estratégia de Segurança (Validação por Assinatura Digital HMAC)
Para gateways padrão no Brasil (como Mercado Pago ou Stripe), a validação deve ser feita usando criptografia **HMAC SHA-256** com uma chave secreta fornecida pelo gateway (`WEBHOOK_SECRET`).

#### Lógica de Validação no Next.js (App Router Route Handler):
```typescript
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text(); // Necessário ler o corpo cru para a validação HMAC
    const signature = req.headers.get("x-signature") || ""; // Cabeçalho contendo a assinatura do gateway
    
    // Chave secreta configurada nas variáveis de ambiente locais (.env)
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Webhook secret não configurado" }, { status: 500 });
    }

    // Calcula a assinatura esperada com HMAC SHA-256
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    // Validação em tempo constante contra ataques de timing
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expectedSignature, "utf-8")
    );

    if (!isValid) {
      console.warn("⚠️ Assinatura de webhook inválida!");
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }

    // Corpo validado e seguro para processamento
    const payload = JSON.parse(rawBody);
    const { orderId, status } = payload; // Exemplo de payload

    if (status === "approved") {
      // Atualização atômica do pedido para status Pago
      await prisma.orders.update({
        where: { id: orderId },
        data: { 
          status: "paid",
          updated_at: new Date()
        }
      });
      console.log(`✅ Pedido ${orderId} atualizado para PAGO via webhook.`);
    }

    // Retorna 200 OK para o Gateway parar de tentar enviar a notificação
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    // Retorna 500 em caso de erro interno para o gateway tentar novamente mais tarde
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
```

### 3.2. Regras de Resiliência:
1.  **Idempotência:** O sistema deve verificar o status do pedido no banco de dados. Se o pedido já estiver marcado como `paid`, a rota deve ignorar a execução de atualizações secundárias (envio de e-mail, geração de nota) e retornar imediatamente `200 OK` (evitando processamento duplicado).
2.  **Timeout Rápido:** O processamento interno do webhook não deve atrasar a resposta ao gateway. O ideal é validar a assinatura, atualizar o banco de dados principal e responder imediatamente. Processamentos pesados (ex: disparar e-mail) devem ser delegados a filas de segundo plano (*background jobs*).
