# 📋 Guia de Prompts da AVA Vitória (Esteira de Codificação)

Esta camada serve como o manual operacional final. Ela define a ordem cronológica de desenvolvimento, os marcos de entrega (Fases) e os prompts cirúrgicos que você (Genera) fornecerá para as IAs executoras programarem o sistema no Next.js + PostgreSQL.

---

## 1. O Roteiro de Codificação (Fases de Desenvolvimento)

Para respeitar as diretrizes de **Mudanças Cirúrgicas** e **Simplicidade Primeiro**, o desenvolvimento será dividido em 4 fases sequenciais. Cada fase deve ser totalmente testada e homologada localmente por você antes de iniciar a próxima.

```
+------------------------------------------------------------+
| FASE 1: O Esqueleto (Database Setup, Prisma & Seed)         |
+------------------------------------------------------------+
                              │
                              ▼
+------------------------------------------------------------+
| FASE 2: A Alma Dinâmica (Injeção de Variáveis CSS & Admin) |
+------------------------------------------------------------+
                              │
                              ▼
+------------------------------------------------------------+
| FASE 3: O Corpo (Vitrine, Grid 3 Colunas, Hover Carrossel)  |
+------------------------------------------------------------+
                              │
                              ▼
+------------------------------------------------------------+
| FASE 4: O Fluxo de Informação (API Catalog XML, Webhooks)  |
+------------------------------------------------------------+
```

---

## 2. Detalhamento Técnico das Fases (Para Especificação de Prompts)

### 🚀 FASE 1: O Esqueleto & Dados (Setup Tecnológico)
*   **Objetivo:** Estabelecer a fundação do Next.js, as conexões com o PostgreSQL e criar dados de teste (Seed).
*   **Entregas:**
    1.  Inicializar o projeto Next.js com TypeScript e CSS Modules.
    2.  Configuração do Prisma ORM e modelagem do arquivo `schema.prisma` contendo as 6 tabelas especificadas no [README do Esqueleto](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/estrutura/Esqueleto/README.md).
    3.  Criação e execução do script de migração (`prisma migrate dev`).
    4.  Criação de um script `prisma/seed.ts` para carregar dados básicos:
        *   Configuração visual padrão do e-commerce (Vinho Escuro `#1F080F`, Dourado `#D4AF37`, fontes `Outfit` e `Plus Jakarta Sans`) inserida em `site_settings`.
        *   Pelo menos 6 produtos urbanos (ex: moletons oversized, t-shirts premium) com variantes de estoque de tamanho (P, M, G, GG) e cor, e links de imagem placeholders 9:16 em `product_images`.

### 🌸 FASE 2: A Alma Dinâmica (Customização Fina)
*   **Objetivo:** Implementar o painel administrativo de controle estético e fazer a loja ler as cores do banco.
*   **Entregas:**
    1.  Criar a rota protegida `/admin/design-system` com inputs de cores (Color Pickers) e seletores de fontes, permitindo editar e salvar o JSON da tabela `site_settings`.
    2.  Implementar no arquivo `/app/layout.tsx` do Next.js uma consulta ao banco que busque a configuração visual ativa e a injete como CSS Variables dinâmicas em uma tag `<style>` global no cabeçalho do documento, além de importar dinamicamente os links do Google Fonts correspondentes.

### 📐 FASE 3: O Corpo (Vitrine & UX/UI)
*   **Objetivo:** Desenhar a vitrine conceitual Balenciaga com as imagens 9:16 e o Hover Carrossel inteligente.
*   **Entregas:**
    1.  Criar a rota principal da Home `/` exibindo os produtos ativos em uma grade de **3 colunas** (com responsividade para mobile e tablet).
    2.  Implementar o componente `ProductCard.tsx` (Client Component) com:
        *   Exibição da imagem de capa.
        *   Detecção de mouse-over (`onMouseEnter`) que ativa as setas laterais de navegação, indicadores de bolinhas e inicia o pré-carregamento assíncrono das demais imagens.
        *   Suporte a loop infinito na navegação de fotos.
        *   Suporte a gestos touch (swipe) para navegação móvel.
    3.  Implementar o Drawer deslizante da Sacola de compras que desliza da lateral direita sem recarregar a tela.

### ⚡ FASE 4: O Fluxo de Informação (APIs & Integrações)
*   **Objetivo:** Abrir os endpoints de comunicação externa e transações seguras de checkout.
*   **Entregas:**
    1.  Implementar a rota `/api/catalog/meta` gerando o feed XML no padrão RSS 2.0 (namespaces `xmlns:g`) puxando os dados de produtos e variantes direto do banco.
    2.  Implementar o fluxo `/api/checkout` com transação Prisma isolada (`tx.$queryRaw` + `FOR UPDATE` em SQL) para reservar estoque e emitir a cobrança.
    3.  Implementar o webhook `/api/webhooks/payment` validando a assinatura criptográfica em HMAC SHA-256 com a chave secreta local de forma idempotente.

---

## 3. Prompts de Execução Prontos para Uso (Copiar e Colar)

Abaixo estão os prompts exatos de comando estruturados que você fornecerá ao agente executor de IA para cada fase de desenvolvimento.

### 📝 Prompt para FASE 1 (Copiar e passar para a IA executora):
```markdown
Você é o Agente Executor da AVA Vitória. Sua missão é implementar a FASE 1 da nossa esteira de desenvolvimento: O Esqueleto.

---

### 1. ARQUIVOS DE REFERÊNCIA
Por favor, leia atentamente a arquitetura do banco e regras de segurança descritas em:
* docs/estrutura/Esqueleto/README.md

### 2. REGRAS DE OURO OBRIGATÓRIAS
* PROIBIDO o uso de GREP. Faça listagens diretas de diretórios ou acesse caminhos diretos.
* DEPLOY EXCLUSIVO LOCAL: Não faça git push nem scripts de deploy automáticos para VPS. Todo código permanece local para validação do Genera.
* Mudanças Cirúrgicas: Não limpe nem refatore códigos adjacentes desnecessários.

### 3. TAREFAS DE EXECUÇÃO
1. Configure um projeto Next.js (TypeScript, CSS Modules) limpo na pasta raiz do projeto.
2. Inicialize o Prisma ORM e escreva as 6 tabelas no arquivo schema.prisma de acordo com a modelagem do README do Esqueleto (site_settings, products, product_images, stock_variants, orders, order_items).
3. Crie e aplique a migração inicial no banco PostgreSQL local.
4. Crie um script prisma/seed.ts que insira no banco:
   - Configurações estéticas padrão na tabela site_settings (Colors: bg = '#1F080F', accent = '#D4AF37'; Fonts: title = 'Outfit', body = 'Plus Jakarta Sans').
   - Pelo menos 6 produtos fictícios de streetwear premium, divididos em variantes de tamanho e cor, com estoque maior que zero, vinculando imagens fictícias na proporção 9:16.

### 4. ENTREGÁVEIS
- Arquivo schema.prisma configurado e migrado.
- Script de Seed executado com sucesso.
- Um resumo rápido das tabelas criadas no banco local.
---
```

---

### 📝 Prompt para FASE 2 (Copiar e passar para a IA executora):
```markdown
Você é o Agente Executor da AVA Vitória. Sua missão é implementar a FASE 2 da nossa esteira de desenvolvimento: A Alma Dinâmica.

---

### 1. ARQUIVOS DE REFERÊNCIA
Leia os seguintes guias conceituais e técnicos:
* docs/estrutura/Alma/README.md
* docs/estrutura/Esqueleto/README.md (seção 4 - Integração Dinâmica)

### 2. REGRAS DE OURO OBRIGATÓRIAS
* PROIBIDO o uso de GREP.
* DEPLOY EXCLUSIVO LOCAL.
* Estética da Subtração: CSS limpo, bordas de 1px, sem negritos excessivos e fontes leves.

### 3. TAREFAS DE EXECUÇÃO
1. Crie uma rota `/admin/design-system` (com formulário) que consulte a tabela site_settings no banco de dados e permita ao administrador editar e salvar a paleta de cores (bg, accent, text_primary, text_secondary, border), tipografias e o desfoque de fundo.
2. No arquivo raiz de layout `/app/layout.tsx` do Next.js:
   - Faça uma chamada ao banco de dados para recuperar as configurações estéticas de site_settings.
   - Injete dinamicamente essas propriedades como variáveis CSS (:root) dentro de uma tag <style> no <head>.
   - Gere o link da URL do Google Fonts correspondente dinamicamente e injete no cabeçalho para carregar as fontes configuradas no painel.

### 4. ENTREGÁVEIS
- Painel funcional em /admin/design-system salvando dados no PostgreSQL.
- Layout raiz injetando as variáveis CSS e Google Fonts em tempo de renderização.
---
```

---

### 📝 Prompt para FASE 3 (Copiar e passar para a IA executora):
```markdown
Você é o Agente Executor da AVA Vitória. Sua missão é implementar a FASE 3 da nossa esteira de desenvolvimento: O Corpo (Grid e Carrossel).

---

### 1. ARQUIVOS DE REFERÊNCIA
Leia as diretrizes visuais e comportamentais da vitrine:
* docs/estrutura/Corpo/README.md

### 2. REGRAS DE OURO OBRIGATÓRIAS
* PROIBIDO o uso de GREP.
* DEPLOY EXCLUSIVO LOCAL.
* Estética da Subtração: Bordas finas de 1px, efeito glassmorphic e visual Balenciaga.

### 3. TAREFAS DE EXECUÇÃO
1. Crie a página da vitrine principal em `/` exibindo os produtos do banco de dados em uma grade elegante de 3 colunas em desktop.
2. Implemente o componente ProductCard.tsx exatamente como especificado no README do Corpo:
   - Exiba a imagem de capa (proporção 9:16).
   - No hover (onMouseEnter): ative as setas laterais com estilo glassmorphic, bolinhas indicadoras no rodapé e pré-carregue as outras imagens em segundo plano.
   - As setas devem folhear as fotos em loop infinito (quando chegar na última, volta para a primeira).
   - Adicione suporte a touch (swipe) para telas móveis.
3. Crie o Drawer deslizante para a sacola de compras na lateral direita, ativado por um clique no ícone do cabeçalho.

### 4. ENTREGÁVEIS
- Rota principal com grid 3 colunas e responsividade.
- Componente ProductCard funcionando com carrossel dinâmico e sem limite de fotos.
- Drawer da sacola operando de forma fluida.
---
```

---

### 📝 Prompt para FASE 4 (Copiar e passar para a IA executora):
```markdown
Você é o Agente Executor da AVA Vitória. Sua missão é implementar a FASE 4 da nossa esteira de desenvolvimento: O Fluxo de Informação (APIs e Webhooks).

---

### 1. ARQUIVOS DE REFERÊNCIA
Leia os contratos de API e regras de segurança:
* docs/estrutura/FluxoInformacao/README.md
* docs/estrutura/Esqueleto/README.md (seção 3 - Transações Seguras)

### 2. REGRAS DE OURO OBRIGATÓRIAS
* PROIBIDO o uso de GREP.
* DEPLOY EXCLUSIVO LOCAL.

### 3. TAREFAS DE EXECUÇÃO
1. Implemente a rota `/api/catalog/meta` (GET) gerando e servindo um XML RSS 2.0 com o namespace xmlns:g contendo produtos, preços, links dinâmicos e variantes de estoque prontos para alimentar a sacolinha do Instagram Shopping.
2. Implemente a rota `/api/checkout` (POST) recebendo carrinho e dados do cliente:
   - Abra uma transação Prisma e execute um bloqueio de linha SQL (`FOR UPDATE` na tabela stock_variants) para reservar e descontar o estoque fisicamente com segurança ACID.
   - Crie o pedido com status 'pending' no banco.
3. Implemente o webhook `/api/webhooks/payment` (POST) recebendo as notificações do gateway de pagamento:
   - Valide de forma segura o cabeçalho x-signature usando criptografia HMAC SHA-256 e comparação de tempo seguro (`timingSafeEqual`) para evitar falsificações.
   - Atualize de forma idempotente o status do pedido para 'paid' se o pagamento for aprovado.

### 4. ENTREGÁVEIS
- URL /api/catalog/meta servindo o XML de catálogo dinâmico.
- APIs de Checkout e Webhook seguras, robustas e protegidas contra concorrência e falsificações.
---
```
