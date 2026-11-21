# 🏭 MATRIZ DE DEPARTAMENTOS X DADOS DA API — DIMONA DROPSIMPLES
**Fornecedor:** Camisa Dimona (Dropsimples v2)  
**Endpoint Base:** `https://admin.camisadimona.com.br/api/v2`  
**Autenticação:** Header HTTP `api-key`

---

## ⚠️ AVISO DE ALINHAMENTO DA MESA REDONDA
> [!IMPORTANT]
> **O QUE A DIMONA ENTREGA:** Silk Digital HD (Kornit) frente e costas em 975 SKUs, NF-e Olist com chave 44 dígitos e link Danfe, Rastreio J&T Express e Webhook de status em tempo real.  
> **O QUE A DIMONA NÃO ENTREGA (NÃO COBRAR!):**
> * ❌ **Não possui Gerador de Mockups Fotorealistas por API** (Tripoint/Marketing deve usar o Studio Web da Dimona ou as maquetes locais).
> * ❌ **Não faz Bordado 3D em Alto Relevo** (apenas DTF em bonés e Silk HD em malhas).
> * ❌ **Não possui catálogo de cores de linhas** para bordado.
> * ❌ **Não personaliza o encarte da caixa (packing slip) por API**.

---

## 📊 Cruzamento: 8 Departamentos da AVA X Dados da API Dimona

| Depto & Titular | Campos Específicos do JSON da Dimona | Utilidade Prática no Dia a Dia | O que NÃO esperar da Dimona |
| :--- | :--- | :--- | :--- |
| **01 · Jurídico & Compliance**<br>*(Flávio)* | `nfe.key`<br>`nfe.number`<br>`nfe.series`<br>`nfe.danfe_url`<br>`client.document` (CPF/CNPJ) | • Chave de 44 dígitos para arquivo fiscal permanente.<br>• Link do Danfe Olist para comprovação tributária.<br>• Blindagem contra autuações na SEFAZ. | Não gera relatórios jurídicos automatizados de garantia; o prazo legal de 30 dias do CDC deve ser controlado pela AVA. |
| **02 · Financeiro & ERP**<br>*(Flávio)* | `items[].unit_price`<br>`items[].total_price`<br>`shipping.cost`<br>`total_order_value` | • Alimentação do COGS (Custo de Mercadoria Vendida).<br>• Conciliação dos pagamentos PIX/Boleto com a conta da Dimona.<br>• Cálculo exato da margem líquida real de cada pedido. | Não faz split automático de pagamento com os 4 sócios; o faturamento cai na conta do titular e é conciliado no Bling. |
| **03 · Arquitetura & TI**<br>*(Armando)* | `status_id`<br>`created_at`<br>`updated_at`<br>`webhook_payload`<br>`error_message` | • Gatilho do Webhook (`/api/webhooks/dimona`) em tempo real.<br>• Monitoramento de latência e disponibilidade dos servidores da Dimona.<br>• Logs de payload bruto no PostgreSQL para integridade de dados. | Não possui API GraphQL nem ambiente de Sandbox isolado (testes exigem pedidos reais ou cancelamento rápido). |
| **04 · Produção & Fornecedores**<br>*(Armando)* | `status_id` (`23` = Coleta)<br>`status` ("Aguardando Coleta")<br>`items[].sku`<br>`items[].technique` ("silk_hd")<br>`items[].front_print_url`<br>`items[].back_print_url` | • Acompanhamento visual das 5 etapas da esteira no `/admin/producao`.<br>• Auditoria de SLA de produção da fábrica (prazo padrão de 3 a 5 dias úteis).<br>• Conferência se a fábrica imprimiu a arte correta na frente e nas costas. | Não fornece fotos reais da peça saindo da esteira Kornit antes do envio. |
| **05 · Atendimento & SAC**<br>*(Gustavo)* | `shipping_method_name` ("J&T")<br>`tracking_code`<br>`tracking_url`<br>`client.address` | • Transbordo imediato do link de rastreio para o WhatsApp/E-mail do cliente.<br>• Identificação antecipada de insucesso de entrega pela J&T.<br>• Resolução de trocas por defeito de costura ou estampa. | A Dimona não atende o cliente final da AVA; todo suporte é executado por Gustavo via Concierge AVA. |
| **06 · Vendas, Tráfego & Canais**<br>*(Gustavo)* | `shipping.estimated_delivery`<br>`shipping.cost`<br>`client.zipcode` | • Mapeamento do custo e tempo de frete da fábrica (Rio de Janeiro) para Sul/Sudeste/Nordeste.<br>• Apoio para criação de campanhas de "Frete Grátis acima de R$ 250". | A Dimona não faz impulsionamento de vendas nem integração direta com Mercado Livre (o Hub é o Bling). |
| **07 · Marketing & Branding**<br>*(Tripoint)* | `items[].name`<br>`items[].sku_name` (ex: "Oversized 220g", "Prime Pele de Pêssego") | • Definição do discurso de valor das campanhas (destacar gramatura pesada 220g e toque peletizado).<br>• Alinhamento do catálogo da vitrine oficial com os 975 SKUs disponíveis. | ❌ **NÃO PEDIR MOCKUPS POR API À DIMONA.** As imagens para redes sociais devem ser criadas pelo Tripoint ou geradas via Studio Dimona. |
| **08 · Atelier Criativo & Mídias**<br>*(Tripoint)* | Gabarito de Estampa Dimona:<br>`3435 x 4680 px` (300 DPI)<br>Área de impressão Silk HD (`35 x 45 cm`) | • Produção das matrizes PNG sem fundo para Frente e Costas.<br>• Posicionamento do Selo AVA na Nuca (16cm / 1100px).<br>• Encaixe automático sem margem nas linhas tracejadas. | A Dimona não aceita arquivos vetoriais de bordado (`.dst`/`.pes`); apenas imagens bitmap (`PNG` / `JPG`) em alta resolução. |
