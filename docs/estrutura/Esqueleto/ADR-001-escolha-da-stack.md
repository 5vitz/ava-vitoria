# ADR-001: Escolha da Stack de Desenvolvimento para o AVA Vitória E-commerce

## Status
Accepted (Junho de 2026)

## Contexto
O e-commerce da **AVA Vitória** exige:
1.  **SEO Impecável:** Para garantir que as páginas de produtos apareçam no topo das buscas do Google.
2.  **Performance de Carregamento (CWV/LCP):** Uma vitrine pesada com mídias verticais (proporção 9:16) inspirada na Balenciaga precisa de carregamento ultra-rápido para não afastar clientes.
3.  **Ambiente Unificado:** Facilidade de deploy local pelo Genera e consistência técnica na VPS Contabo.
4.  **Consistência de Dados (ACID):** Transações robustas para controle de estoque de variantes limitadas.

Estávamos decidindo entre uma arquitetura desacoplada (React/Vite no frontend + FastAPI/Python no backend) ou uma arquitetura unificada baseada em renderização no servidor.

---

## Decisão
Adotaremos o **Next.js (React)** como o framework fullstack oficial do projeto, utilizando o **App Router** e **TypeScript/JavaScript**, conectado diretamente ao banco de dados relacional **PostgreSQL**.

### Raciocínio Técnico:
*   **SEO Nativo (SSR/ISR):** O Next.js renderiza o catálogo e os detalhes do produto no servidor (Server-Side Rendering). O robô do Google lê o HTML completo, indexando os metadados perfeitamente.
*   **Monorepo Produtivo:** O backend (APIs de checkout, webhooks, feed do Instagram) e o frontend (vitrine, painel administrativo) coexistem na mesma base de código.
*   **Otimização de Mídias (Next Image):** O componente `<Image />` do Next.js realiza otimização automática de imagens (geração de formatos modernos como WebP/AVIF e redimensionamento sob demanda), crucial para manter a performance das fotos 9:16.
*   **Conexão Direta com PostgreSQL:** Usaremos um cliente leve ou ORM (como Prisma ou Kysely) para interagir com o PostgreSQL de forma tipada e segura dentro dos Server Actions e rotas de API do Next.js.

---

## Consequências

### O que se torna mais fácil:
*   **Gestão de Deploy:** Apenas um processo Node.js precisa rodar em produção (VPS Contabo) e localmente.
*   **SEO & Compartilhamento:** Compartilhar links de produtos no WhatsApp ou Instagram exibirá o card de preview (Open Graph) perfeitamente renderizado pelo servidor.
*   **Performance:** Imagens otimizadas automaticamente reduzem o consumo de banda e aceleram o carregamento no celular do cliente.

### O que se torna mais difícil / Exige atenção:
*   **Lógica de Renderização:** O time de desenvolvimento (IAs executoras) deve respeitar a divisão entre *React Server Components (RSC)* (executados por padrão no servidor) e *Client Components* (comportamentos interativos como o hover carrossel e o drawer de carrinho que exigem a diretiva `'use client'`).
*   **Conexão de Banco em Serverless/Rotas:** Configurar corretamente o pool de conexões com o PostgreSQL no Next.js para evitar estouro de conexões máximas no banco.
