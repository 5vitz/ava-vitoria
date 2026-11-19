# 🏛️ PLANO MESTRE DE MELHORIA CONTINUADA — SISTEMA DE LOGIN SOCIETÁRIO & OS 23 AGENTES DA ORQUESTRA AVA SEM LIMITES

> **Data de Consolidação:** 19 de Novembro de 2026  
> **Direção Estratégica & Arquitetura de Processos (BPM):** Armando Sinkovitz (*Genera*)  
> **Orquestração Técnica:** Maestro Lincoln (Antigravity)  
> **Objetivo:** Transformar cada um dos **23 Agentes da Mesa Redonda** (e a fundação de **Login Individual dos 4 Sócios**) de protótipos visuais em **motores funcionais (MVP+)** persistidos no PostgreSQL, com fluxo de dados auditado, ferramentas (*Tools*) reais e memória compartilhada entre **Armando, Flávio, Tripoint e Gustavo**.

---

## 📐 1. Anatomia Padrão Adotada em Todos os Planos (4 Pilares de IA + 3 Pilares BPM)

Cada plano individual desta pasta foi desenhado sobre a mesma matriz de 7 seções:
1. **🧠 Modelo (Motor de Raciocínio & Decisão):** Determinístico (TypeScript/SQL) onde a matemática exige erro zero, ou Híbrido (Regras + LLM `Gemini`) onde há interpretação e geração de linguagem natural.
2. **📜 Instruções e Persona (*System Prompt & Guardrails*):** O papel do agente, seu tom de voz e os limites inegociáveis de segurança.
3. **🧰 Ferramentas (*Tools* / Artefatos Ativos):** As rotas de API (`/api/*`), cálculos, validadores criptográficos e conectores externos que o agente aciona.
4. **🗄️ Memória e Contexto (*Artefatos de Persistência*):** As tabelas do PostgreSQL ([`prisma/schema.prisma`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/prisma/schema.prisma)) e chaves de `SiteSettings` que guardam o estado real (nunca mais perdendo dados ao apertar `F5`).
5. **⚡ Gatilhos & Human-in-the-Loop:** O evento que acorda o agente e o ponto exato em que os 4 sócios deliberam.
6. **🔄 Fluxograma do Processo (BPMN Mermaid):** O caminho visual da informação de ponta a ponta.
7. **🛠️ Roteiro Cirúrgico de Implementação (*As-Is ➔ To-Be MVP+*):** O diagnóstico do que falta hoje no código e os arquivos exatos que serão criados/atualizados.

---

## 🗺️ 2. Índice Completo dos Planos de Implementação (Ordem Oficial de Execução)

### 🔐 PRIORIDADE ZERO — Fundação de Governança Startup
* **[00. Sistema de Login Individual dos 4 Sócios, Troca & Recuperação de Senha no BD](./00_Sistema_Login_Societario_4_Socios/PLANO_IMPLEMENTACAO.md)**
  * *Contas Individuais:* `armando`, `flavio`, `tripoint`, `gustavo` (senha inicial única + troca de senha gravada em `bcrypt` no PostgreSQL + recuperação `"Esqueci minha senha"` + vínculo `1 Sócio = 1 Crachá de Voto`).

---

### 🏛️ CAMADA SOBERANA — Diretoria Executiva (`/admin` & `/admin/diretoria`)
1. **[01. Cobrador de Consenso 4/4 (Urna de Votação & Régua WhatsApp / E-mail)](./01_Cobrador_Consenso_4_4/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Tabela `ExecutiveDecision` no PostgreSQL, trava que impede mudança de preço antes do `4/4`, voto autenticado pelo login do sócio e disparo de cobrança aos pendentes.
2. **[02. Sprint Prioritizer (Guardião de Metas & Prazos Comerciais 01/Dez)](./02_Sprint_Prioritizer/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Painel de prontidão em `/admin/diretoria` cruzando contadores reais do banco (Produtos, Artes 300 DPI, Checklist Fiscal) com os marcos dos 4 sócios e escalada de bloqueios para a Urna.

---

### ⚖️ DEPTO 01 — Jurídico & Compliance (`/admin/juridico` · Titular: Flávio)
3. **[03. Dr. Lex (Consultor Jurídico, Fiscal & Compliance)](./03_Dr_Lex/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Persistência real do Checklist dos 14 Documentos no PostgreSQL, Termômetro Fiscal do teto de 38 peças/mês lendo a tabela `orders` e API consultiva real (`/api/juridico/dr-lex`) com histórico compartilhado de pareceres.

---

### ⚙️ DEPTO 02 — Engenharia & TI (`/admin/engenharia` · Titular: Armando)
4. **[04. Software Architect (Arquiteto de Contratos & APIs)](./04_Software_Architect/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Validador ativo dos contratos de API (`/api/catalog/meta` XML, `/llms.txt`, conectores `.env`) com medição de latência em `ms` e contagem de itens publicados no XML da Sacolinha do Instagram.
5. **[05. Database Optimizer (Guardião da Integridade ACID & PostgreSQL)](./05_Database_Optimizer/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Diagnóstico real das 12 tabelas do PostgreSQL, detector de produtos sem indexação de custo e botão de auto-reparo/indexação atômica.
6. **[06. Minimal Change Engineer (Auditor de Escopo Cirúrgico)](./06_Minimal_Change_Engineer/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Inspetor automático do `package.json` e dos arquivos vitais da Vitrine Balenciaga atestando 100% CSS Modules e zero dependências banidas.
7. **[07. Sentinel Security (Segurança Cibernética & Portaria Digital)](./07_Sentinel_Security/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Quadro das 4 contas societárias, log de auditoria de logins/trocas de senha no banco e controle rápido da Portaria (`SiteLock`).
8. **[08. Telemetria de Infraestrutura (Monitor da VPS Contabo & PM2)](./08_Telemetria_Infraestrutura/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Coleta em tempo real de Uptime do processo Node/PM2, consumo de memória RAM (MB e %), carga de CPU e ping do PostgreSQL via módulos nativos `os` e `process`.

---

### 🏭 DEPTO 03 — Produção & Fornecedores (`/admin/producao` · Titular: Armando)
9. **[09. Auditor de Preços Multi-Supplier (Auditoria Preventiva 2h)](./09_Auditor_Precos_Multi_Supplier/PLANO_IMPLEMENTACAO.md)**
   * *Entrega MVP+:* Listagem viva da tabela `SupplierCatalogItem` na aba *Multi-Supplier Hub*, simulador/atualizador de variação de custo acionando a Chave de 2 Posições (`pricingEngine.ts`) e criação automática de alerta na Urna 4/4.
10. **[10. Gestor de Amostras Físicas PoD (Lote Dimona #755-460-927 & Kanban)](./10_Gestor_Amostras_Fisicas_PoD/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Tabela interativa persistida no PostgreSQL para avaliar toque da malha, estampa Silk HD, teste de lavagem e rastreio das 6 amostras físicas + Kanban PoD alimentado pela tabela `orders`.

---

### 💬 DEPTO 04 — Atendimento & SAC (`/atendimento` & `/admin/atendimento` · Titular: Gustavo)
11. **[11. Concierge Virtual 24/7 (Assistente de Vendas na Loja Pública)](./11_Concierge_Virtual_24_7/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* API `/api/atendimento/concierge` que lê o catálogo real de produtos, preços e medidas no PostgreSQL para responder aos clientes em `/atendimento` e grava o log de conversas para Gustavo em `/admin/atendimento`.
12. **[12. Agente Discriminador SAC (Triagem CDC Art. 49 vs. Garantia PoD)](./12_Agente_Discriminador_SAC/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Conexão real do formulário público de Trocas (`/atendimento`) com o PostgreSQL (`POST /api/atendimento/tickets`), classificando automaticamente em `CDC49_TAMANHO` ou `DEFEITO_FABRICA` (garantia Dimona) e exibindo na fila de `/admin/atendimento`.
13. **[13. Escalador Anti-Omissão (Transbordo Zagueiro-Artilheiro)](./13_Escalador_Anti_Omissao/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Relógio real de SLA de 2 horas sobre os chamados abertos, promoção automática para `TRANSBORDADO` aos 4 sócios, disparo de WhatsApp com protocolo e aprovação de 1-clique gravando qual sócio marcou o gol.

---

### 📈 DEPTO 05 — Vendas, Tráfego & Canais (`/admin/vendas` · Titular: Gustavo)
14. **[14. Analista de Tráfego & ROAS (Funil de Conversão & Impulsionamento)](./14_Analista_Trafego_ROAS/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Telemetria do funil de vendas cruzada com pedidos e ticket médio reais do PostgreSQL + botão `🗳️ Propor Ajuste Comercial na Urna` criando pauta real na tabela `ExecutiveDecision`.
15. **[15. Gestor dos 10 Canais (Governança Multicanal & Paridade de Preços)](./15_Gestor_10_Canais/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Persistência do status, links e notas dos 10 Canais no PostgreSQL + calculadora automática de Preço de Paridade por Canal (absorvendo a comissão do marketplace para manter o lucro líquido intacto).

---

### 🚀 DEPTO 06 — Marketing & Branding (`/admin/marketing` · Titular: Tripoint)
16. **[16. Trios 3x3 Balenciaga (Planejador Visual do Feed Instagram 9:16)](./16_Trios_3x3_Balenciaga/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Carregamento automático das fotos 9:16 reais dos produtos da **Coleção Ativa da Vitrine** agrupadas em Trios 3x3, com gerador de legenda e controle de status (`PLANEJADO` / `PUBLICADO`) salvo no banco.
17. **[17. Vault Coupon (Motor de Senhas Virais 10% a 50% OFF — "EU TENHO CUPOM!")](./17_Vault_Coupon/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Contador automático de `@amigos` marcados em comentários do Instagram, gerador de senhas únicas prefixadas (`1AVA-...` a `5AVA-...`), tabela de cupons emitidos persistida no PostgreSQL e validador de desconto sobre o estoque físico.

---

### 🎨 DEPTO 07 — Atelier Criativo & Mídias (`/admin/atelier` · Titular: Tripoint)
18. **[18. Lookbook 9:16 (Diretor de Fotografia IA & Matriz MDV 26 Chaves)](./18_Lookbook_9_16/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Conexão real da Aba 3 do Atelier com a tabela `Artwork` do PostgreSQL + Editor/Inspetor interativo das **26 Chaves Fotográficas (`writing_matrix_26`)** e compilador de prompt 9:16.
19. **[19. Curador de Matrizes 300 DPI (Gabaritos Dimona/Reserva & Hash SHA-256)](./19_Curador_Matrizes_300_DPI/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Cadastro de novas Artes Matrizes no PostgreSQL com validação de gabarito 300 DPI (`3435×4680` / `2400×2400`) e geração real do certificado criptográfico **SHA-256** via Node `crypto`.
20. **[20. Content Creator (Redator Streetwear & Descrições de Produto)](./20_Content_Creator/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Gerador de descrições sensoriais (Pilares AVA + Malhas 220g/180g), manifestos e copies com botão de 1-clique para aplicar e salvar a descrição diretamente no produto do catálogo (`Product.description`).
21. **[21. Whimsy Injector (Auditor UX Balenciaga & Tokens `#FEFCF5`)](./21_Whimsy_Injector/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Inspetor vivo dos 5 pilares visuais Balenciaga (Marfim `#FEFCF5`, `mix-blend-mode: multiply`, Vidro Leitoso 16px nos 8 vizinhos, Borda 1px no 1º clique e Textura Halftone 0.07) com botão de restauração instantânea do Preset Canônico.

---

### 💎 DEPTO 08 — Financeiro, Fiscal & ERP (`/admin/financeiro` · Titular: Flávio)
22. **[22. Unit Economics & DRE (Simulador de Lucro Líquido & Submissão à Urna 4/4)](./22_Unit_Economics_DRE/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Carregamento das margens e da Chave de 2 Posições reais do PostgreSQL ao abrir `/admin/financeiro` + submissão de qualquer mudança de margem ou chave para a **Urna de Votação 4/4** (`POST /api/decisions`) com dossiê de Lucro Líquido Real.

---

### 🎼 FECHAMENTO SOBERANO — O Maestro da Orquestra
23. **[23. Maestro Lincoln (Orquestrador Geral Técnico & Diagnóstico 360º)](./23_Maestro_Lincoln/PLANO_IMPLEMENTACAO.md)**
    * *Entrega MVP+:* Endpoint agregador (`/api/diretoria/maestro-overview`) que lê os contadores reais de todos os 22 músicos no PostgreSQL, alimentando as métricas ao vivo dos 8 cards departamentais no `/admin` e o Parecer Estratégico dinâmico em `/admin/diretoria`.
