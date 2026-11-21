# 🏭 FORNECEDOR 02 — PRINTFUL BRASIL (PREMIUM & BORDADO 3D)
**Departamento Responsável:** Depto 04 · Produção & Fornecedores  
**Titular do Departamento:** Armando Sinkovitz (Genera)  
**Status da Integração:** 🟢 100% Homologada (API v1/v2 com Token Bearer Ativo)

---

## 📋 1. Ficha Cadastral & Posicionamento Estratégico

| Parâmetro | Detalhes |
| :--- | :--- |
| **Plataforma** | Printful Brasil (Printful Inc.) |
| **Painel de Controle** | [https://www.printful.com/dashboard](https://www.printful.com/dashboard) |
| **Custo de Assinatura** | **R$ 0,00 / mês** (Sem mensalidades — modelo sob demanda puro) |
| **Moeda de Cobrança** | **BRL (Reais)** |
| **Produção & Logística** | Centro de produção parceiro no Brasil (sem taxas alfandegárias de importação) |
| **Idioma do Painel Web** | Inglês / Espanhol *(Barreira de entrada que afasta concorrentes amadores; o sistema da AVA abstrai isso 100% em português)* |
| **Diferencial Competitivo** | **Bordado 3D Puff (Alto Relevo)** em bonés, jaquetas, moletons pesados e acabamento de alta costura |

---

## 🔑 2. Credenciais de API & Ambiente

Credenciais cadastradas e validadas no arquivo `.env` da aplicação:

```env
PRINTFUL_API_KEY="ur14bwJFkkx2g7gUOImFKeIDKkgWn7uxAbEI5Jb3"
PRINTFUL_API_URL="https://api.printful.com"
```

### Escopos Ativos do Token:
A chave foi testada com sucesso (resposta `200 OK`) e possui permissões completas para:
* `orders`: Criação, consulta e cancelamento de pedidos.
* `stores_list`: Gestão da loja AVA Sem Limites.
* `sync_products`: Sincronização de catálogo e preços.
* `file_library`: Upload de arquivos de alta resolução e matrizes de bordado (`.dst`).
* `webhooks`: Notificações de expedição e rastreamento.
* `product_templates`: Templates de design e gabaritos de produtos.

---

## 📡 3. Especificação OpenAPI & Endpoints Estratégicos

A especificação técnica completa de 41 endpoints está arquivada neste diretório:  
📄 **[`openapi.json`](./openapi.json)** (OpenAPI 3.0 Standard)

### Endpoints de Alto Impacto:
1. **`POST /orders/estimate-costs`**  
   Simula o custo exato de produção, frete e tributos antes de confirmar a transação do cliente.
2. **`POST /mockup-generator/create-task`**  
   Gera maquetes fotorealistas em tempo real dos modelos vestindo as peças da AVA para exibição no catálogo.
3. **`GET /files/thread-colors`**  
   Consulta a paleta de 15 cores oficiais de linhas para Bordado 3D Puff.
4. **`POST /shipping/rates`**  
   Cota fretes e prazos de entrega nacionais.

---

## 🧢 4. Carro-Chefe: Linha Bonés High Profile (Bordado 3D)

O produto de maior prestígio e margem da AVA na Printful:

* **Modelo:** Boné Retro Trucker High Profile Mescla/Preto (Snapback)
* **Técnica:** Bordado 3D Puff Frontal com o monograma geométrico AVA
* **Custo de Produção:** ~R$ 100,00
* **Preço Sugerido de Venda:** **R$ 229,00**
* **Margem Líquida Unitária:** **~R$ 129,00 (56,3% de margem)**
* **Justificativa de Valor:** Produto de nicho premium, competindo de igual para igual com marcas como New Era e John John.

---

## 🛠️ 5. Controladores no Código da AVA

* **Healthcheck & Status:** [`src/app/api/production/printful/status/route.ts`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/api/production/printful/status/route.ts)
* **Aba de Gestão no Admin:** Visível na aba **Printful Brasil** em [`/admin/producao`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/producao/page.tsx).
