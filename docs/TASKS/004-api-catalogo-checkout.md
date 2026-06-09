# TASK-004: Fluxo de Informação (API Catalog XML, Checkout & Webhooks) (Camada 4)

## 📋 Status
*   **Status:** Pendente / Backlog
*   **Prioridade:** Alta
*   **Data de Criação:** 2026-06-08
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Precisamos expor a vitrine da AVA Vitória para redes de compras externas (Instagram Shopping / Meta Catalog) e habilitar o fluxo completo de transação de pagamento seguro com controle transacional e atualizações em tempo real via webhook.

---

## ⚙️ Requisitos do Fluxo (Camada 4: Fluxo de Informação)

1.  **Feed XML de Catálogo (`/api/catalog/meta`):**
    *   Endpoint do tipo GET que gera dinamicamente um XML no padrão RSS 2.0.
    *   Utilizar os namespaces oficiais da Meta (`xmlns:g="http://base.google.com/ns/1.0"`).
    *   Puxar todos os produtos e suas variantes ativas do PostgreSQL, gerando tags corretas de ID, título, preço, link de imagem, estoque e disponibilidade.

2.  **API de Checkout Seguro (`/api/checkout`):**
    *   Endpoint do tipo POST para submeter os itens comprados e dados do cliente.
    *   **Segurança Transacional (Prevenção de Overselling):** Executar a reserva de estoque dentro de uma transação Prisma isolada utilizando bloqueio de linha SQL (`FOR UPDATE` em `stock_variants`) no PostgreSQL.
    *   Garantir integridade ACID: reduzir a quantidade física no estoque e gerar o pedido (`Order` e `OrderItem`) com status 'pending' de forma atômica.

3.  **Webhook de Pagamento (`/api/webhooks/payment`):**
    *   Endpoint do tipo POST para receber confirmação de pagamento do gateway de pagamento.
    *   **Validação Criptográfica:** Validar o cabeçalho de assinatura (`x-signature`) usando comparação de tempo seguro (`timingSafeEqual`) e HMAC SHA-256 com a chave secreta definida localmente.
    *   **Idempotência:** Garantir que o processamento do webhook não duplique transações nem re-mude status já finalizados.
