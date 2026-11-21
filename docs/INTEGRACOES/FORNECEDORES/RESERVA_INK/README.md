# 🏭 FORNECEDOR 03 — RESERVA INK (B2B CORPORATIVO & PROPAGANDA)
**Departamento Responsável:** Depto 04 · Produção & Novos Negócios  
**Titular do Departamento:** Armando Sinkovitz (Genera)  
**Status da Integração:** 🟡 Especificação OpenAPI Arquivada (`api-1.yaml`) — Operação B2B

---

## 🎯 1. Posicionamento Estratégico (A "Jogada de Mestre")

Após análise financeira da Mesa Redonda, o modelo da Reserva INK foi cirurgicamente reposicionado:

* **O Problema do B2C Convencional:** A mensalidade de **R$ 159,00/mês** comira a margem de vendas pulverizadas no varejo inicial, onde a Dimona já atende com custo fixo R$ 0,00.
* **A Grande Oportunidade (B2B Corporativo):**  
  A Reserva possui uma **linha de camisetas de entrada com estampa frontal simples de baixíssimo custo**, combinada com o **imenso prestígio do selo Reserva**.
* **Aplicação Comercial:**  
  Envio de propostas corporativas para empresas de tecnologia, colégios particulares, academias e agências de propaganda para fornecimento de uniformes premium e camisas comemorativas.
* **Vantagem Imbatível:**  
  Apresentar para uma diretoria de empresa que os uniformes de seus funcionários ou brindes de eventos serão da grife **Reserva**, por um custo apenas ligeiramente superior ao de confecções genéricas.

---

## 🔑 2. Dados de Acesso & Plataforma

| Parâmetro | Detalhes |
| :--- | :--- |
| **Plataforma** | Reserva INK (Grupo Arezzo&Co / Reserva) |
| **Painel de Controle** | [https://painel.reserva.ink](https://painel.reserva.ink) |
| **Titular** | Armando Sinkovitz (Genera) |
| **API Endpoint Base** | `https://api.reserva.ink` |
| **Autenticação** | Token de API / Bearer Token por loja |

---

## 📡 3. Especificação OpenAPI da Reserva INK

A documentação técnica oficial da API foi extraída e arquivada neste diretório:  
📄 **[`api-1.yaml`](./api-1.yaml)** (OpenAPI 3.0.1 com 37 endpoints documentados)

### Endpoints Principais:
* **`POST /v1/stores/shipping_simulation`**: Simulação antecipada de frete e prazos para lotes corporativos volumosos.
* **`POST /v1/stores/external_orders`**: Envio de pedidos em lote vindos de contratos fechados B2B.
* **`GET /v1/stores/external_orders/{id}`**: Acompanhamento de status de produção e despacho.

---

## 📑 4. Documentos & Tabelas de Custos Arquivados

Neste diretório estão preservados todos os documentos originais da Reserva INK:

1. **[`01_Planos_Assinatura_ReservaINK.pdf`](./01_Planos_Assinatura_ReservaINK.pdf):**  
   Termos e comparativos dos planos de assinatura.
2. **[`02_Tabela_Custos_Camisas_ReservaINK.pdf`](./02_Tabela_Custos_Camisas_ReservaINK.pdf):**  
   Tabela completa de custos base por tipo de tecido, cor e modelo.
3. **[`Tabela1.png`](./Tabela1.png) & [`Tabela2.png`](./Tabela2.png):**  
   Grades visuais de faixas de desconto por volume e estampas frontais.

---

## 💼 5. Simulador B2B no Painel `/admin/producao`

O painel administrativo da AVA conta com um simulador nativo para orçamentos rápidos:
* **Acesse:** Menu superior de Fornecedores ➔ Aba **Reserva INK (B2B Corporativo)**
* **Recursos:**
  * Seletor de volume de lote (20, 50, 100 ou 200 camisetas).
  * Margem comercial customizável.
  * Cálculo instantâneo de Custo Total, Preço de Venda Corporativo e Lucro Líquido do Contrato.
  * Visualização de vantagens competitivas para envio de proposta aos sócios e clientes.
