# 🎨 07. Departamento de Atelier de Artes & Prompts

> **Agentes de IA Alocados:** ASK Nexus, PLAN Narrative & Artwork Architect  
> **Lema Autoral:** *"Quando você veste Star-Ink, você veste uma criação autêntica, protegida e única!"*  
> **Objetivo:** Desenvolvimento contínuo das obras de arte autorais dos Drops da Star-Ink, aplicando o método de *Structured Prompt Engineering*, o filtro rigoroso da *Estética da Subtração* e registro criptográfico na Blockchain.  

---

## 🏛️ Atribuições & Escopo

1. **Concepção Visual & DNA Gráfico:** Análise de referências e extração do DNA visual (traço mínimo 1px hairline, geometria, contraste `#ffffff` em fundo `#000000`).
2. **Filtro da Estética da Subtração:** Refinamento dos conceitos poéticos e visuais para remover qualquer excesso ornamental.
3. **Compilação Técnica JSON Schema A3:** Parametrização matemática das artes para o formato físico A3 (300 DPI / 4200x4800px PNG transparente) pronto para impressão DTG HD.
4. **Guarda de Autoria, Blockchain & Proof of Concept:** Registro do JSON Prompt e ancoragem de hash SHA-256 na Blockchain para prova pública e incontestável de anterioridade, não-plágio e autoria autoral.

---

## 🛡️ Mecanismos Anti-Omissão (Prevenção de Falhas)

| Risco de Omissão | Mecanismo Preventivo Automatizado | Ação de Emergência |
| :--- | :--- | :--- |
| **Arte com Erro de DPI ou Formato Incorreto** | O Artwork Architect valida a exportação do arquivo em 300 DPI, canal alfa transparente e resolução mínima de 4200x4800px. | Re-renderização automática da matriz A3 antes da gravação no repositório. |
| **Extrapolação dos Limites da Estampa DTG** | Validação das margens de ancoragem percentual (`x_percent`, `y_percent`) para evitar cortes de estampa no peito da camiseta. | Ajuste das coordenadas no JSON Schema. |
| **Perda do Prompt Original de Geração** | Todo arquivo PNG aprovado é obrigatoriamente acompanhado pelo seu arquivo `prompt_schema_*.json` no mesmo diretório. | Reconstrução do JSON a partir do log do Atelier. |

---

## 🤖 Agentes de IA Alocados

* 🎨 **ASK Nexus:** Leitor de Alma Visual e extração de DNA gráfico. Analisa imagens e conceitos visuais, traduzindo estética em parâmetros.
* 📐 **PLAN Narrative:** Arquiteto de narrativa e filtro da Estética da Subtração. Aplica o princípio de que *"a arte está pronta quando não se pode retirar mais nada"*.
* 🛠️ **Artwork Architect:** Compilador técnico encarregado de gerar os arquivos JSON Schema A3 e exportar as matrizes de impressão de altíssima definição (300 DPI PNG).

---

## 📚 Documentos Normativos do Atelier

* 📄 **[Matriz Canônica de 24 Chaves Estruturais (PDF)](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/MATRIZ_24_CHAVES_ESTRUTURAIS_JSON.pdf):** Arquitetura espelhada de JSON (Leitura Analítica & Escrita Autoral) dividida nos Eixos Ontológico, Epistemológico e Metodológico.
* 👁️ **[Coleção "Op-Art Reload — Outono/2027" & Arquitetura do MDV (26 Chaves)](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/COLECAO_OP_ART_RELOAD_E_ARQUITETURA_MDV.md):** Motor de Decomposição Visual (`scripts/mdv_scanner.py` + IA), expansão para 26 Chaves, Subprocesso de Desvinculação Autoral (mínimo 7 chaves mutadas) e implementação no Banco PostgreSQL e Painel `/admin/atelier`.
* 🎨 **[Engenharia de Prompt JSON & Matriz de Cores PoD](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/ENGENHARIA_DE_PROMPT_E_MATRIZ_DE_CORES_POD.md)** & **[Guia de Engenharia Reversa de Artes](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/atelier/ENGENHARIA_REVERSA_DE_ARTES.md)**.

---

## 📌 Tarefas Prioritárias do Atelier

* [x] **Implementação do MDV (26 Chaves) & Compilador Prompt-to-Image no Banco de Dados e Painel `/admin/atelier`:** Concluído em 24/11/2026 (`src/lib/artworks.ts`, `src/app/api/artworks/route.ts`, pasta-projeto `Testes`, obra inaugural `AVA-TEST-001` e editor interativo das 26 chaves).
* [ ] **Criação da Identidade Visual do Selo COA (Certificate of Authenticity):**  
  Desenvolver a matriz gráfica do Selo Oficial de Autenticidade sob a *Estética da Subtração* (traço 1px *hairline*, monocromático, proporção áurea), integrando os elementos de geometria vetorial da Blockchain.


