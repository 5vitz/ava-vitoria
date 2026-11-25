# 🔌 MATRIZ CENTRAL DE INTEGRAÇÕES & GOVERNANÇA — AVA SEM LIMITES

Este diretório é o **Repositório Soberano de Credenciais, Especificações Técnicas e Manuais de Integração** da AVA Sem Limites.

> [!IMPORTANT]
> **LEI DE TRANSPARÊNCIA DA MESA REDONDA:**
> Nenhum sócio pode ficar "trancado para fora" de nenhum departamento. Toda integração com fornecedores, gateways, ERP e canais de venda deve ter sua documentação, e-mails de acesso, titulares e especificações de API registrados de forma padronizada neste repositório.

---

## 🗺️ Arquitetura das Camadas de Integração

```mermaid
flowchart LR
    subgraph CANAIS["🛒 CANAIS DE VENDA (10 Vitrines)"]
        Amazon["Amazon"]
        ML["Mercado Livre"]
        Shopee["Shopee"]
        Insta["Instagram Shopping"]
        Site["Loja Oficial AVA"]
    end

    subgraph HUB["⚡ HUB CENTRAL ERP (Integrador Fiscal)"]
        Bling["Bling ERP v3<br/>(Emissão NF-e / Conciliação)"]
    end

    subgraph FORNECEDORES["🏭 FORNECEDORES PoD (Fabricação)"]
        Dimona["Dimona Dropsimples<br/>(API v2 + Webhook)"]
        Printful["Printful Brasil<br/>(API v1/v2 + Bordado 3D)"]
        Reserva["Reserva INK<br/>(API v1 + B2B Corporativo)"]
    end

    CANAIS <--> Bling
    CANAIS <--> Site
    Site <--> Bling
    Site <--> FORNECEDORES
    Bling <--> FORNECEDORES
```

---

## 📂 Organização das Pastas

### 1. 🏭 [FORNECEDORES/](./FORNECEDORES)
* **[DIMONA/](./FORNECEDORES/DIMONA):** API REST v2, Catálogo de 975 SKUs, Planilha de Importação em Lote, Pedido de Amostras `#755-460-927`, Danfe Olist e [Matriz de Deptos x API Dimona](./FORNECEDORES/DIMONA/MATRIZ_DEPTOS_API.md).
* **[PRINTFUL/](./FORNECEDORES/PRINTFUL):** Especificação completa `openapi.json` (OpenAPI 3.0), Token Bearer, Mockup Generator de Estúdio, Boné Bordado 3D e [Matriz de Deptos x API Printful](./FORNECEDORES/PRINTFUL/MATRIZ_DEPTOS_API.md).
* **[RESERVA_INK/](./FORNECEDORES/RESERVA_INK):** Especificação oficial `api-1.yaml` (`api.reserva.ink`), Saques e Extrato API, Estratégia B2B Uniformes e [Matriz de Deptos x API Reserva INK](./FORNECEDORES/RESERVA_INK/MATRIZ_DEPTOS_API.md).

### 2. ⚡ [HUB_ERP_BLING/](./HUB_ERP_BLING)
* O coração que liga os fornecedores aos canais de venda. Emissão de NF-e (Modelo 55), conciliação com o MEI/Simples Nacional do Flávio e geração de etiquetas de envio.
* **Rotas OAuth 2.0 Prontas para Transplante:** Localizadas em `/home/artz/Documentos/Antigravity/Star-Ink/src/app/api/auth/bling/` (`authorize/route.ts` e `callback/route.ts`), agendadas para ativação no momento do credenciamento da conta Bling da AVA.

### 3. 🛒 [CANAIS_DE_VENDA/](./CANAIS_DE_VENDA)
* As 10 Vitrines Oficiais de Vendas (Amazon, Mercado Livre, Shopee, Google Shopping, Meta Commerce, etc.) com seus formulários de credenciamento, titulares responsáveis e regras de comissão.

### 4. 🚚 TELEMETRIA LOGÍSTICA PÓS-COLETA & SAC (`Intelipost TMS / J&T Express GraphQL`)
* **Endpoint Oficial Integrado:** `POST https://tracking-graphql.intelipost.com.br/` (`clientId: "1168"` — Dimona).
* **Rota Interna Ativa:** [`src/app/api/sac/tracking/route.ts`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/api/sac/tracking/route.ts), alimentando a Torre Logística Pós-Coleta do **Depto 05 · SAC (Gustavo)** em [`/admin/atendimento`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/atendimento/page.tsx) com diagnóstico automático de gargalos de doca/coleta e comunicados proativos ao cliente.

