# 🏭 FORNECEDOR 01 — DIMONA DROPSIMPLES
**Departamento Responsável:** Depto 04 · Produção & Fornecedores  
**Titular do Departamento:** Armando Sinkovitz (Genera)  
**Status da Integração:** 🟢 100% Homologada & Operacional (API REST v2 + Webhook)

---

## 📋 1. Ficha Cadastral & Acesso Institucional

| Parâmetro | Detalhes |
| :--- | :--- |
| **Razão Social / Plataforma** | Dimona Silk e Malhas Ltda (Dropsimples) |
| **Painel de Controle** | [https://admin.camisadimona.com.br](https://admin.camisadimona.com.br) |
| **E-mail de Cadastro** | `armando@tripoint.com.br` / `armandosinkovitz@gmail.com` |
| **Custo de Assinatura** | **R$ 0,00 / mês** (Sem mensalidades fixas — custo apenas por peça produzida) |
| **Tipo de Produção** | PoD (Print on Demand) — Silk Digital HD (Kornit) e DTF |
| **Sede / Parque Fabril** | Rio de Janeiro / RJ (Frete rápido para Sudeste/ES) |

---

## 🔑 2. Credenciais de API & Ambiente

As chaves estão registradas de forma segura no arquivo `.env` do projeto e na VPS de produção:

```env
DIMONA_API_KEY="49b5a2a652ec0f60cef407983cd8f84c"
DIMONA_API_URL="https://admin.camisadimona.com.br/api/v2"
```

> [!NOTE]
> Para autenticar requisições na API v2 da Dimona, envie o header HTTP:  
> `api-key: 49b5a2a652ec0f60cef407983cd8f84c`

---

## 📡 3. Endpoints Homologados

### A. Consulta de Pedido (`GET /api/v2/order/{id}`)
Retorna o estado detalhado do pedido, incluindo ID de status, chave da NF-e, código de rastreio e URL de acompanhamento.

* **Exemplo de Chamada:**
  ```bash
  curl -X GET "https://admin.camisadimona.com.br/api/v2/order/755-460-927" \
       -H "api-key: 49b5a2a652ec0f60cef407983cd8f84c"
  ```
* **Campos Críticos de Retorno:**
  * `id`: ID interno da Dimona
  * `partner_order_id`: ID gerado pela AVA Sem Limites
  * `status_id`: Código numérico do ciclo de vida (Ex: `23` = Aguardando Coleta)
  * `status`: Descrição em texto
  * `tracking_code` / `tracking_url`: Dados de transporte (J&T Express, Correios, Jadlog)
  * `nfe`: Chave de acesso e número da NF-e emitida pela Olist ERP

### B. Criação Automática de Pedido (`POST /api/v2/order`)
Envia pedidos aprovados no site ou vindos do Bling para produção imediata.

---

## 🪝 4. Webhook em Tempo Real (AVA Sem Limites)

Para evitar consultas manuais ou pooling desnecessário, o e-commerce da AVA possui uma rota de Webhook pronta para receber disparos instantâneos da Dimona sempre que o status de um pedido avançar:

* **URL de Produção:** `https://www.ava-vitoria.com.br/api/webhooks/dimona`
* **Controlador no Código:** [`src/app/api/webhooks/dimona/route.ts`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/api/webhooks/dimona/route.ts)
* **Ação Automática:** Atualiza a tabela de pedidos no banco de dados e notifica o painel `/admin/producao` instantaneamente.

---

## 📊 5. Catálogo de SKUs & Planilha de Importação em Lote

Este diretório contém os arquivos mestres oficiais fornecidos pela diretoria de PoD da Dimona:

1. **[`Dropsimples _ Catálogo de SKU's .xlsx`](./Dropsimples%20_%20Catálogo%20de%20SKU's%20.xlsx):**  
   Catálogo com **975 SKUs ativos**, mapeando códigos exatos para Camisetas Classic 30.1, Quality, Prime 180g (Pele de Pêssego), Oversized Heavy 220g, Estonadas Vintage, Polos, Moletons, Canecas e Bonés.
2. **[`planilha_exemplo_dimona.xlsx`](./planilha_exemplo_dimona.xlsx):**  
   Template de 20 colunas para importação em lote de pedidos (com URLs de artes frente/costas, endereços dos clientes e variações).
3. **[`Catalogo_Oficial_Dropsimples_Dimona.pdf`](./Catalogo_Oficial_Dropsimples_Dimona.pdf):**  
   Manual visual de produtos, gramaturas de tecidos e gabaritos de estamparia.

---

## 📦 6. Registro de Amostras de Validação Técnica

* **Pedido Piloto:** `#755-460-927` (6 peças encomendadas para auditoria de gramatura, toque e fidelidade de cores).
* **Documentação Detalhada:** Consulte [`REGISTRO_PEDIDO_AMOSTRAS_DIMONA.md`](./REGISTRO_PEDIDO_AMOSTRAS_DIMONA.md).
* **NF-e Fiscal:** [`DANFE - ERP da Olist.pdf`](./DANFE%20-%20ERP%20da%20Olist.pdf) (NF nº 114273).
