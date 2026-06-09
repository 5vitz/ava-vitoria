# TASK-000: O Esqueleto (Database Setup, Prisma & Seed)

## 📋 Status
*   **Status:** Concluído ✅
*   **Prioridade:** Alta (Crítica)
*   **Data de Conclusão:** 2026-06-08
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Resumo da Implementação

Estabelecemos a fundação tecnológica da vitrine AVA Vitória:

1.  **Next.js Workspace:** Inicializamos o boilerplate Next.js com TypeScript e Vanilla CSS Modules no diretório raiz do projeto.
2.  **PostgreSQL em Docker:** Configuramos um container Docker executando o banco PostgreSQL 15 localmente na porta `5432` com credenciais padrão de desenvolvimento.
3.  **Prisma 7 & Driver Adapter:** Configuramos o Prisma 7 para rodar com driver adapter `pg` / `@prisma/adapter-pg` para gerenciar a persistência local de forma otimizada.
4.  **Tabelas & Migrações:** Criamos o arquivo `schema.prisma` definindo as 6 tabelas oficiais (`site_settings`, `products`, `product_images`, `stock_variants`, `orders`, `order_items`) e aplicamos a primeira migração física.
5.  **Database Seeding:** Populamos o banco local com os tokens de design do Design System (`design_system` em `site_settings`) e cadastramos 18 produtos de streetwear com fotos reais vinculadas da coleção (`01.jpg` a `18.jpg`) e grade completa de estoque (P, M, G, GG) e cores (Vinho, Preto, Branco).
6.  **Organização dos Ativos:** Movemos a pasta `imagens` para o diretório `/public` de modo a torná-la acessível e servida de forma estática pelo Next.js.
