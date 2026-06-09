# TASK-002: Painel de Controle Dinâmico para Customização do Design System (Camada 1)

## 📋 Status
*   **Status:** Pendente / Backlog
*   **Prioridade:** Alta (Crítica para Reunião de Quarta-feira)
*   **Data de Criação:** 2026-06-07
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Para permitir flexibilidade total durante a reunião de apresentação com o cliente na próxima quarta-feira, a **Camada 1 (Alma)** do e-commerce deve ser completamente customizável em tempo real. O Genera precisa de uma interface no Painel de Controle administrativo que permita alterar e salvar as propriedades visuais da loja de forma amigável.

---

## ⚙️ Requisitos de Customização (Painel Admin)

O painel deve expor seletores simples (color pickers, inputs de texto, seletores numéricos) para alterar:
*   **Paleta de Cores:**
    *   Cor de Fundo Principal (`--color-bg`).
    *   Cor de Destaque/Dourado (`--color-accent`).
    *   Cores dos Textos (Primário e Secundário).
    *   Opacidade das bordas e painéis translúcidos.
*   **Tipografia:**
    *   Fontes de Títulos (carregando nomes da biblioteca do Google Fonts).
    *   Fontes do Corpo e UI.
    *   Pesos de fontes ativos.
*   **Estética & Efeitos:**
    *   Largura de bordas e raio de arredondamento.
    *   Intensidade do desfoque de fundo (`backdrop-filter: blur()`).

---

## 🛠️ Arquitetura Técnica Proposta

1.  **Persistência (Banco de Dados):**
    *   Uma tabela simples no PostgreSQL (ex: `site_settings` ou `design_system_config`) contendo uma única linha ou estrutura chave-valor para salvar o estado dos tokens visuais.
2.  **Renderização Dinâmica (Frontend):**
    *   O backend injetará essas variáveis diretamente em uma tag `<style>` global no `<head>` do documento HTML na renderização (SSR) ou disponibilizará via endpoint `/api/design-tokens` no carregamento da aplicação:
    ```html
    <style id="dynamic-design-tokens">
      :root {
        --color-bg: [VALOR_DO_BANCO];
        --color-accent: [VALOR_DO_BANCO];
        /* ... demais variáveis ... */
      }
    </style>
    ```
    *   Isso garante que qualquer alteração salva no painel seja refletida **instantaneamente** em todas as páginas do site após um simples F5 (refresh), ou até mesmo via JavaScript sem refresh (*Live Preview*).
