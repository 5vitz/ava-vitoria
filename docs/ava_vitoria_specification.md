# Especificação Técnica e Conceitual — AVA Vitória E-commerce

> [!IMPORTANT]
> **DIRETRIZ DE REBRAND (EM PLANEJAMENTO):** O projeto passa a se chamar oficialmente **AVA Sem Limites**, operando sob a URL **www.avasemlimites.com.br**. As menções a "AVA Vitória" na documentação legada serão substituídas progressivamente durante a execução, mas a nova marca já rege as decisões atuais.

## 1. BRANDING & IDENTIDADE VISUAL (Nossa essência)
A **AVA Vitória** é uma marca de streetwear de luxo inspirada na cultura urbana local de Vitória, mesclando a atitude das ruas com o refinamento estético do luxo.

### 1.1. Os Três Pilares (AVA)
*   **A**titude: Presença marcante, rebeldia urbana e expressão autêntica.
*   **V**alorização: Reconhecimento do talento local, do grafite e do material autoral.
*   **A**mizade: Conexão real e engajamento comunitário fiel.

### 1.2. DNA Arquetípico
*   **Explorador (Tônica):** Busca por liberdade, originalidade e novos cenários urbanos.
*   **Amante (Terça):** Apelo estético de ultra-luxo, exclusividade e texturas sensoriais.
*   **Criador (Quinta):** Construção autoral e direção criativa impecável de foto/vídeo.
*   **Rebelde (Sétima):** Quebra de paradigmas e atitude disruptiva.

### 1.3. Design System Estético (Estética da Subtração & Galeria)
*   **Cor de Fundo dos Cards e Molduras (Off-White Marfim):** `#FEFCF5` (com `mix-blend-mode: multiply` nas imagens para fusão contínua).
*   **Header & Elementos Metálicos (Cinza Prata Metálico):** `linear-gradient(180deg, #E2E2E4 0%, #C0C0C5 100%)`.
*   **Contraste & Bordas (Preto Sólido e Linhas de 1px):** `#000000` e `rgba(0, 0, 0, 0.12)`.
*   **Tipografia:**
    *   *Títulos & Destaques:* **Exotc350**, **Geostar** ou **Outfit** (customizáveis no Painel de Controle).
    *   *Corpo & UI:* **Poppins** / **Plus Jakarta Sans** em pesos finos (200/300) para máxima elegância e legibilidade.

---

## 2. USER EXPERIENCE (UX/UI) & ARQUITETURA DE TELAS (Como o cliente sente e navega na loja)
Experiência focada na vitrine de impacto baseada no benchmark da **Balenciaga**, priorizando mídias verticais e navegação fluida de catálogo sem recarregamentos desnecessários.

### 2.1. O Grid da Vitrine (3 Produtos por Linha)
*   Em vez das 4 colunas tradicionais que poluem e diminuem o produto, a vitrine da AVA exibirá **3 produtos por linha** com espaçamento de `24px`.
*   Isso concede maior destaque para as proporções das peças oversized e detalhes da confecção.
*   As fotos de produtos seguirão estritamente a **proporção 9:16** (vertical alta), idênticas às mídias de Stories/Reels, integrando o e-commerce nativamente com a linguagem visual do Instagram.

### 2.2. O Card de Produto Inteligente (Inspeção Ativa no 1º Clique)
*   **Navegação Passiva (Scroll Limpo):** Passar o mouse sobre os cards não dispara setas nem poluição visual.
*   **Inspeção Ativa (1º Clique):** Desenha borda preta de `1px` contornando a célula inteira, ativa setas e bolinhas do carrossel e aplica a película de **Vidro Branco Leitoso** (`rgba(255, 255, 255, 0.78)` com `backdrop-filter: blur(16px)`) nos **8 cards vizinhos** do bloco 3x3.
*   **Interação de Navegação:** O duplo clique (`onDoubleClick`) ou clique no título/preço redireciona o usuário para a página de detalhes (`/produtos/[slug]`).

### 2.3. Produção Criativa & Matrizes PoD 300 DPI (Atelier AVA)
A produção visual e industrial do catálogo opera no **Atelier Unificado (Depto 07)**:
*   **Lookbook Editorial 9:16 & Matriz de Escrita de 26 Chaves (MDV):** Direção de fotografia gerada a partir de prompts estruturados de 26 chaves com controle de mutação e registro de autoria SHA-256.
*   **Gabaritos Finais Print on Demand (300 DPI):** Matrizes de alta resolução padronizadas para **Dimona Dropsimples (Silk HD)** (`3435 × 4680 px` frente/costas e `2400 × 2400 px` bonés) e **Reserva INK** (`4200 × 4800 px`).

---

## 3. ARQUITETURA TÉCNICA & INTEGRAÇÕES (Como a engrenagem do banco de dados, estoque e APIs roda por trás)
Estrutura robusta desenhada para ter escalabilidade horizontal e comunicação em tempo real com redes de venda.

### 3.1. Integração com Instagram Shopping & 10 Canais (Matriz Canônica)
*   O backend da loja gera dinamicamente um feed de produtos estruturado no formato **XML RSS 2.0** (`/api/catalog/meta`) homologado pela Meta para alimentar a "Sacolinha do Instagram".
*   Integração via **Bling ERP (API v3)** para distribuição multicanal nos 10 grandes marketplaces nacionais.

### 3.2. Estrutura de Banco de Dados Relacional
Para consistência robusta de controle de transações, faturamento, precificação dinâmica Multi-Supplier e baixas de estoque:
*   Banco de dados principal: **PostgreSQL** via **Prisma ORM**.
*   Garante integridade transacional ACID (`SELECT ... FOR UPDATE`) no checkout e sincronização automática de margens por categoria.

