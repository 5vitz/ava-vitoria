# 🗺️ Mapa do Planejamento — AVA Vitória

Este diretório centraliza todas as decisões arquiteturais, especificações conceituais e guias técnicos do e-commerce **AVA Vitória**, estruturados de forma modular em 5 camadas.

---

## 📂 Organização das Camadas

*   **🌸 [Alma](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/estrutura/Alma)**: Branding, DNA arquetípico, tom de voz, design system estético (variáveis de cor, tipografia e regras visuais de subtração).
*   **📐 [Corpo](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/estrutura/Corpo)**: Arquitetura de informação e UX/UI (layouts de telas, grid 9:16 de 3 colunas, comportamento do hover carrossel inteligente, fluxos de navegação).
*   **🦴 [Esqueleto](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/estrutura/Esqueleto)**: Engenharia e persistência de dados (modelagem de tabelas PostgreSQL, integridade transacional ACID, segurança de controle de estoque).
*   **⚡ [FluxoInformacao](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/estrutura/FluxoInformacao)**: Integrações de sistemas e APIs (Instagram Shopping Catalog XML/JSON, Webhooks de checkout/gateway de pagamento).
*   **📋 [GuiaPrompts](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/estrutura/GuiaPrompts)**: Fases de codificação e geração de prompts cirúrgicos prontos para a execução da IA.

---

## 📜 Regras de Ouro de Execução (Mesa Redonda)

> [!IMPORTANT]
> 1. **Proibido o uso de GREP:** A ferramenta `grep` está banida por causar instabilidade no console. Use caminhos de arquivos diretos ou buscas cirúrgicas de diretórios.
> 2. **Deploy Exclusivo do Genera:** Lincoln está proibido de fazer `git push` ou disparar scripts de deploy para produção. Toda alteração permanece local para validação manual do Genera.
> 3. **Estética da Subtração:** Interfaces limpas, bordas de 1px, tipografia leve e espaçamentos elegantes.
> 4. **Mudanças Cirúrgicas:** Altere apenas o estritamente necessário para cumprir a tarefa, sem refatorar código adjacente.
