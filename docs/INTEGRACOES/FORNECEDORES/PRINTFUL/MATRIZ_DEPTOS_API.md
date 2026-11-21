# 🌐 MATRIZ DE DEPARTAMENTOS X DADOS DA API — PRINTFUL BRASIL
**Fornecedor:** Printful Brasil (Printful Inc. / Parceiro Fabril Nacional)  
**Endpoint Base:** `https://api.printful.com`  
**Autenticação:** Header HTTP `Authorization: Bearer <PRINTFUL_API_KEY>`  
**Especificação Técnica:** OpenAPI 3.0 (`openapi.json` arquivado na pasta)

---

## ⚠️ AVISO DE ALINHAMENTO DA MESA REDONDA
> [!IMPORTANT]
> **O QUE A PRINTFUL ENTREGA (DIFERENCIAIS EXCLUSIVOS):**
> * ⭐ **Gerador Automático de Mockups Fotorealistas por API** (`/mockup-generator`): maquetes de modelos humanos vestindo a peça da AVA em estúdio de moda.
> * ⭐ **Bordado 3D Puff (Alto Relevo)** em Bonés High Profile com 15 cores de linhas catalogadas (`/files/thread-colors`).
> * ⭐ **Encarte Personalizado da Caixa (Packing Slip)** (`/store/packing-slip`): comprovante dentro do pacote com logo da AVA e mensagem de agradecimento.
> * ⭐ **Simulação Prévia de Custos** (`/orders/estimate-costs`): calcula frete, custo de digitalização da matriz e taxas antes de produzir.
> 
> **O QUE A PRINTFUL NÃO ENTREGA (NÃO COBRAR!):**
> * ❌ **Não tem painel web em Português** (apenas inglês/espanhol — nosso cockpit `/admin/producao` traduz tudo).
> * ❌ **Não é confecção barata de silk serigráfico** (o custo é premium para produtos de alto valor agregado).
> * ❌ **Não absorve devolução por arrependimento de tamanho do cliente** (Art. 49 é absorvido pela margem da AVA).

---

## 📊 Cruzamento: 8 Departamentos da AVA X Dados da API Printful

| Depto & Titular | Campos Específicos do JSON da Printful | Utilidade Prática no Dia a Dia | O que NÃO esperar da Printful |
| :--- | :--- | :--- | :--- |
| **01 · Jurídico & Compliance**<br>*(Flávio)* | `/tax/rates`<br>`costs.tax`<br>`costs.vat`<br>`packing_slip.terms` | • Compliance fiscal e tributário de cobrança nacional em Reais (BRL).<br>• Inserção dos termos de troca da AVA no comprovante da caixa.<br>• Mapeamento de responsabilidade de logística reversa. | Não emite NF-e direta de loja; a NF-e para o cliente é gerada pelo Bling ERP da AVA. |
| **02 · Financeiro & ERP**<br>*(Flávio)* | `/orders/estimate-costs`<br>↳ `subtotal`<br>↳ `discount`<br>↳ `shipping`<br>↳ `digitization`<br>↳ `total` | • Simulação prévia do custo exato em Reais antes do cliente pagar.<br>• Controle do custo de digitalização da matriz de bordado (~R$ 35 pago 1 única vez por arte).<br>• Margem líquida real de 56,3% nos Bonés High Profile (Lucro R$ 129/un). | Não aceita pagamento faturado a prazo; cobrança ocorre via cartão corporativo cadastrado ou saldo em carteira. |
| **03 · Arquitetura & TI**<br>*(Armando)* | Bearer Token OAuth 2.0<br>`/oauth/scopes`<br>`/webhooks`<br>↳ `package_shipped`<br>↳ `package_returned`<br>↳ `order_put_hold` | • Conexão REST com 6 escopos de permissão autenticados.<br>• Escuta de 12 eventos de Webhook para atualização automática do banco PostgreSQL.<br>• Controle de taxa de requisições (Rate Limit de 120 req/min). | Não possui servidor local de desenvolvimento; o ambiente é em nuvem com endpoint de teste (`draft orders`). |
| **04 · Produção & Fornecedores**<br>*(Armando)* | `/orders/{id}`<br>↳ Status: `draft`, `pending`, `inprocess`, `onhold`, `fulfilled`<br>`/approval-sheets`<br>`/reports/statistics` | • Rastreamento da fabricação e bordado 3D peça por peça.<br>• Aprovação técnica da folha de teste do bordado (`approval-sheet`) antes de liberar a produção em série.<br>• Relatório de tempo médio de confecção e taxa de refugo. | Não faz silk à base de água tradicional; todo processo é bordado industrial e DTG digital de alta precisão. |
| **05 · Atendimento & SAC**<br>*(Gustavo)* | Webhook `package_shipped`<br>↳ `shipments[].carrier`<br>↳ `shipments[].tracking_number`<br>↳ `shipments[].tracking_url`<br>Webhook `package_returned` | • Envio instantâneo do código e link de rastreamento para o comprador.<br>• Alerta automático no painel de SAC caso o pacote seja devolvido por endereço incorreto.<br>• Zero dependência de consulta manual. | A Printful não atende o consumidor final da AVA; a portaria de suporte é 100% da AVA Sem Limites. |
| **06 · Vendas, Tráfego & Canais**<br>*(Gustavo)* | `/shipping/rates`<br>↳ `rate`<br>↳ `minDeliveryDays`<br>↳ `maxDeliveryDays` | • Cotação dinâmica de prazos para alimentar os marketplaces (Amazon e Mercado Livre).<br>• Venda internacional viabilizada: a API permite despachar para EUA/Europa caso surjam clientes externos. | A Printful não possui marketplace de venda ao público; ela opera estritamente como braço de confecção invisível. |
| **07 · Marketing & Branding**<br>*(Tripoint)* | **`/mockup-generator/create-task/{id}`**<br>↳ `mockup_url`<br>↳ `extra_mockups[]`<br>**`/store/packing-slip`**<br>↳ `logo_url`, `message` | ⭐ **RECURSO EXCLUSIVO:** Geração de fotos de alta definição com modelos reais vestindo os bonés da AVA em cenários de moda.<br>• Inserção do logotipo da AVA e mensagem de agradecimento na folha interna da caixa. | As fotos geradas pela API são maquetes limpas; o design de posts e anúncios para o Instagram continua a cargo do Tripoint. |
| **08 · Atelier Criativo & Mídias**<br>*(Tripoint)* | **`/files/thread-colors`**<br>Gabarito Boné High Profile:<br>`Área Bordado 3D: 14 x 6 cm`<br>Formatos: `.dst`, `.ai`, `.png` (300 DPI) | ⭐ **CATÁLOGO DE 15 CORES DE LINHAS:** Permite ao Tripoint escolher exatamente as cores da linha do bordado 3D Puff (dourado, prata, cru, preto, etc.).<br>• Gabaritos de curvatura da copa do boné estruturado. | Não aceita arquivos de baixa resolução (< 150 DPI); a digitalização para bordado exige traços com espessura mínima de 1.3mm. |
