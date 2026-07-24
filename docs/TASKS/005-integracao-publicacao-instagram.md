# TASK-005: Publicação Simultânea e Agendamento no Instagram via Painel Admin

## 📋 Status
*   **Status:** Pendente / Especificada (Pronta para Execução)
*   **Prioridade:** Alta (Integração Social & E-commerce)
*   **Data de Especificação:** 2026-07-21
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Integrar o Painel Administrativo (`/admin`) do e-commerce da **AVA Sem Limites** à **API de Publicação de Conteúdo da Meta (Instagram Content Publishing Graph API)**. O objetivo é permitir que, ao cadastrar um novo produto ou coleção no painel do site, o lojista possa publicar o carrossel de fotos no Feed do Instagram da marca (`@avasemlimites`) com **um único clique** ou **agendar a publicação simultânea** para um horário futuro (Cultura de Drop).

---

## ⚡ Recursos e Funcionalidades Requeridas

### 1. Publicação Direta (Um Clique)
*   Ao salvar o cadastro do produto no `/admin` com suas imagens verticais (proporção 9:16), o lojista poderá marcar a caixa *"Publicar também no Instagram"*.
*   O backend envia o lote de fotos no formato de carrossel do Feed via Meta Graph API.
*   O post vai ao ar no Instagram da marca no mesmo instante em que o produto fica visível na vitrine do site.

### 2. Agendamento Simultâneo (Drops & Lançamentos)
*   O lojista pode selecionar a opção *"Agendar Lançamento"* definindo uma data e hora no futuro (ex: *Sexta-feira às 20:00*).
*   **No Horário Agendado:**
    1.  O banco de dados PostgreSQL altera o status do produto de `is_active = false` para `is_active = true` (liberando a compra no site).
    2.  O sistema aciona o parâmetro `scheduled_publish_time` da API da Meta, liberando o carrossel de fotos no Instagram da marca na exata mesma hora.

### 3. Integração Dinâmica com a Sacolinha (Meta Commerce)
*   O feed XML dinâmico do e-commerce (`/api/catalog/meta`) continuará rodando de forma assíncrona.
*   A Meta lê o catálogo atualizado e permite que o post publicado receba as etiquetas/tags de preço clicáveis apontando direto para o checkout do site.

---

## 🛠️ Requisitos Técnicos de Implementação

1.  **Credenciais da Meta:**
    *   `INSTAGRAM_BUSINESS_ACCOUNT_ID`: ID da conta comercial `@avasemlimites`.
    *   `META_ACCESS_TOKEN`: Token de acesso de longa duração com permissões `instagram_content_publish`, `pages_read_engagement` e `instagram_basic`.
2.  **Fluxo de Chamadas da API (Container Carousel):**
    *   *Passo A:* Criar contêineres de mídia individuais para cada imagem 9:16 (`POST /{ig-user-id}/media?image_url=...&is_carousel_item=true`).
    *   *Passo B:* Criar o contêiner mestre de carrossel (`POST /{ig-user-id}/media?media_type=CAROUSEL&children=[IDs_DOS_ITEMS]&caption=...`).
    *   *Passo C (Imediato):* Publicar o contêiner (`POST /{ig-user-id}/media_publish?creation_id=...`).
    *   *Passo C (Agendado):* Enviar o parâmetro `scheduled_publish_time` (timestamp UNIX) para agendamento automático na Meta.
3.  **Cron Job / Task Local:**
    *   Caso haja agendamento local de liberação no banco de dados, o processo PM2 executa a verificação periódica para sincronizar o status `is_active` dos produtos agendados.

---

## 📜 Homologação
*   Testar envio de carrossel de teste no `/admin` para ambiente de sandbox/staging da Meta.
*   Validar compatibilidade dos arquivos WebP/JPG de proporção 9:16 gerados pelo Next.js com os padrões aceitos pela Meta.
