# TASK-003: Vitrine Conceitual com Grid de 3 Colunas e Hover Carrossel (Camada 3)

## 📋 Status
*   **Status:** Concluído / Homologado
*   **Prioridade:** Alta
*   **Data de Criação:** 2026-06-08
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Para implementar a vitrine de e-commerce conceitual (fortemente inspirada no design minimalista da Balenciaga), precisamos criar a página principal `/` exibindo os produtos em uma grade vertical de 3 colunas e um componente de cartão de produto inteligente que reage ao mouse do usuário folheando imagens.

---

## ⚙️ Requisitos da Vitrine (Camada 3: Corpo)

1.  **Grid de 3 Colunas (`/`):**
    *   Exibir os produtos ativos carregados diretamente do banco de dados PostgreSQL.
    *   Grid responsivo de 3 colunas em desktop, 2 colunas em tablet e 1 coluna em mobile.
    *   Espaçamento minimalista (gap pequeno, bordas finas de 1px separando os itens, tipografia leve).

2.  **Componente `ProductCard.tsx` (Hover Carrossel):**
    *   Exibir a imagem de capa do produto na proporção vertical 9:16.
    *   Ao passar o mouse (`onMouseEnter`):
        *   Ativar setas laterais com estilo translúcido (glassmorphism).
        *   Exibir indicadores de bolinhas (bullets) no rodapé.
        *   Iniciar o pré-carregamento (pre-fetching) em segundo plano das outras imagens do produto para evitar delay de carregamento.
    *   Permitir navegação em loop infinito (ao clicar para passar da última foto, volta para a primeira).
    *   Suporte a gestos touch (swipe) para navegação por toque em dispositivos móveis.

3.  **Sacola de Compras (Cart Drawer):**
    *   Um menu lateral (Drawer) que desliza da lateral direita ao clicar no ícone de sacola no menu superior.
    *   Deve permitir adicionar, remover e alterar quantidades de itens da sacola sem recarregar a página (Client-Side state).
