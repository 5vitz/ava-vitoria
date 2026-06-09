# ✅ Tarefas Concluídas (DONE)

Este diretório contém o histórico de todas as tarefas de planejamento, design, banco de dados e codificação que já foram totalmente implementadas, testadas e homologadas no projeto **AVA Vitória**.

---

## 📜 Histórico de Conclusões

### 🦴 TASK-001: O Esqueleto (Database Setup, Prisma & Seed)
* **Status:** Concluído em Junho de 2026.
* **Resumo:**
  1. **Next.js Setup:** Inicializado o projeto Next.js (com TypeScript, App Router e CSS Modules) no diretório raiz.
  2. **Banco de Dados (Docker):** Subido um container Docker para rodar o PostgreSQL de desenvolvimento localmente (`ava-postgres` na porta `5432`).
  3. **Prisma ORM (Versão 7):** Configurado o ORM Prisma utilizando o padrão de driver adapter `pg` / `@prisma/adapter-pg` (requisição obrigatória no Prisma 7).
  4. **Modelagem:** Escrito o arquivo `schema.prisma` mapeando a modelagem física completa (tabelas: `site_settings`, `products`, `product_images`, `stock_variants`, `orders`, `order_items`).
  5. **Migrações:** Aplicadas as migrações iniciais com sucesso no banco local.
  6. **Seed:** Desenvolvido e executado o script de Seed (`prisma/seed.ts`), populando o banco com a identidade visual padrão (Vinho Escuro/Dourado) e cadastrando 18 peças de streetwear premium (grade completa P/M/G/GG e cores Vinho/Preto/Branco) com referências para as 18 fotos reais da coleção em `public/imagens/COLECAO`.
  7. **Organização Estática:** Criada a pasta `public/` e movida a pasta `imagens` (incluindo as fotos processadas do banner e das logos preta/branca) para dentro dela, de modo que o Next.js possa servi-las de forma estática.
