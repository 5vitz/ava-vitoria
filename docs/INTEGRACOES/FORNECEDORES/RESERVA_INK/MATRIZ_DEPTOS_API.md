# 👔 MATRIZ DE DEPARTAMENTOS X DADOS DA API — RESERVA INK
**Fornecedor:** Reserva INK (Grupo Arezzo&Co / Reserva)  
**Endpoint Base:** `https://api.reserva.ink`  
**Autenticação:** Header HTTP `Authorization: Bearer <TOKEN>`  
**Especificação Técnica:** OpenAPI 3.0.1 (`api-1.yaml` arquivado na pasta)

---

## ⚠️ AVISO DE ALINHAMENTO DA MESA REDONDA
> [!IMPORTANT]
> **O QUE A RESERVA INK ENTREGA (DIFERENCIAIS EXCLUSIVOS):**
> * ⭐ **O Selo e a Grife Reserva:** Prestígio incomparável para propostas comerciais de **Uniformes B2B, Escolas Particulares e Propaganda**.
> * ⭐ **Extrato Financeiro e Saques via API** (`/balance_extract` & `/withdraws`): controle automatizado de repasses e comissões da conta.
> * ⭐ **Módulo Nativo de Trocas e Reembolsos** (`/exchanges` & `/refunds`): esteira de pós-venda estruturada pelo próprio ecossistema Reserva.
> * ⭐ **Simulador de Frete Corporativo** (`/shipping_simulation`): cotação instantânea para pacotes volumosos de atacado.
> 
> **O QUE A RESERVA INK NÃO ENTREGA (NÃO COBRAR!):**
> * ❌ **NÃO PRODUZ ESTAMPA NAS COSTAS (LIMITAÇÃO FÍSICA ESTRUTURAL)!** Apenas estampa frontal.
> * ❌ **Não possui Gerador Automático de Mockups Fotorealistas por API** (Tripoint não deve cobrar essa função aqui).
> * ❌ **Não faz Bordado 3D em Bonés** (apenas estamparia DTG em linha de vestuário).
> * ❌ **Mensalidade de R$ 159/mês se aberta para varejo diário** (por isso operamos em modo B2B Corporativo sob encomenda).

---

## 📊 Cruzamento: 8 Departamentos da AVA X Dados da API Reserva INK

| Depto & Titular | Campos Específicos do JSON da Reserva INK | Utilidade Prática no Dia a Dia | O que NÃO esperar da Reserva INK |
| :--- | :--- | :--- | :--- |
| **01 · Jurídico & Compliance**<br>*(Flávio)* | `/v1/stores/exchanges`<br>`/v1/stores/orders/{id}/refunds`<br>`customer.document` (CPF/CNPJ) | • Trâmite estruturado de trocas e devoluções homologado pelo Grupo Arezzo&Co.<br>• Contratos B2B de fornecimento corporativo de uniformes com CNPJ faturado. | A Reserva não assume risco cível fora dos termos contratuais; a garantia legal ao cliente é da AVA. |
| **02 · Financeiro & ERP**<br>*(Flávio)* | `/v1/stores/balance`<br>`/v1/stores/balance_extract`<br>`/v1/stores/withdraws`<br>`items[].base_cost_cents`<br>`commission_cents` | ⭐ **GESTÃO DE SALDO VIA API:** Extrato completo de créditos, taxas de serviço e agendamento de saques para a conta PJ da AVA.<br>• Apuração da margem líquida dos contratos corporativos fechados. | Não isenta a mensalidade de R$ 159/mês se a loja B2C estiver publicada online (opera via pedidos externos). |
| **03 · Arquitetura & TI**<br>*(Armando)* | Bearer Token<br>`/v1/stores/external_orders`<br>`/v1/stores/shipping_simulation` | • Roteamento de pedidos externos B2B disparados pelo painel `/admin/producao`.<br>• Integração com a especificação OpenAPI 3.0.1 (`api-1.yaml`). | A documentação pública não possui fórum aberto de desenvolvedores; o suporte a API é via chamados da Reserva. |
| **04 · Produção & Fornecedores**<br>*(Armando)* | `/v1/stores/external_orders/{id}`<br>↳ Status do pedido<br>↳ Itens faturados<br>↳ Prazo de confecção | • Monitoramento da fila fabril de lotes corporativos (20 a 200 camisetas).<br>• Auditoria da linha básica de algodão (ótimo custo com estampa frontal simples). | ❌ **NÃO ENVIAR PEDIDOS COM ESTAMPA NAS COSTAS.** A esteira fabril da Reserva rejeita pedidos com arquivos traseiros. |
| **05 · Atendimento & SAC**<br>*(Gustavo)* | `/v1/stores/exchanges/{id}`<br>`order.tracking_code`<br>`order.tracking_url` | • Acompanhamento de protocolos de troca abertos na esteira da Reserva.<br>• Envio do código de rastreamento para o comprador ou gestor da empresa cliente. | Em contratos B2B de uniformes, o atendimento de troca é feito com a diretoria da empresa cliente, e não no varejo. |
| **06 · Vendas, Tráfego & Canais**<br>*(Gustavo)* | `/v1/stores/shipping_simulation`<br>`/v1/stores/promotions/progressive`<br>`/v1/stores/promotions/order_bump` | • Simulação antecipada de frete para propostas comerciais de grandes lotes corporativos.<br>• Utilização de gatilhos de desconto progressivo por quantidade de peças (20, 50, 100 un). | A Reserva INK não possui canal de venda cruzada nos marketplaces tradicionais (Mercado Livre / Shopee). |
| **07 · Marketing & Branding**<br>*(Tripoint)* | `/v1/stores/leads`<br>`/v1/stores/abandoned_carts`<br>Selo Reserva Oficial | ⭐ **AUTORIDADE DA GRIFE:** Construção de material comercial enfatizando: *"Uniformes e Camisetas Corporativas da sua Empresa com a qualidade e o prestígio da Reserva"*. | ❌ **NÃO COBRAR GERADOR DE MOCKUPS 3D DA RESERVA.** As maquetes devem ser criadas no Photoshop pelo Tripoint ou pelo estúdio web. |
| **08 · Atelier Criativo & Mídias**<br>*(Tripoint)* | Gabarito Reserva INK:<br>`4200 x 4800 px` (300 DPI)<br>Área de impressão: **Apenas Frente** | • Preparação de artes de alto impacto visual centralizadas no peito ou bolso.<br>• Utilização do gabarito em altíssima resolução (`4200x4800 px`) em formato PNG sem fundo. | ❌ **PROIBIDO CRIAR ARTE DE COSTAS PARA ESTA FABRICAÇÃO.** Focar estritamente em artes frontais. |
