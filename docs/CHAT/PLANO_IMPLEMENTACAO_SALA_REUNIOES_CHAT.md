# 🏛️ PLANO DE IMPLEMENTAÇÃO · SALA DE REUNIÕES E COMPARTILHAMENTOS (`AVA BOARDROOM`)

> **Status do Documento:** `PLANEJAMENTO HOMOLOGADO` (100% Alinhado entre Armando "Genera" & Maestro Lincoln)
> **Localização:** `/home/artz/Documentos/Antigravity/Ava-Vitoria/docs/CHAT/PLANO_IMPLEMENTACAO_SALA_REUNIOES_CHAT.md`
> **Protótipo Visual Interativo Homologado:** [`docs/CHAT/prototipo_chat_societario.html`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/CHAT/prototipo_chat_societario.html)
> **Regra Arquitetural Soberana:** 100% CSS Modules nativos (`.module.css`) seguindo estritamente a paleta oficial do Painel Executivo (`#EFE4CC` Palha Claro, `#DFCFA8` Palha Escuro, `#000000` Preto Sólido, tipografia e bordas de [`admin-cockpit.module.css`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/admin-cockpit.module.css)).

---

## 1. Visão Estratégica e Propósito Operacional

A **Sala de Reuniões e Compartilhamentos (`AVA Boardroom`)** resolve três necessidades estruturais da operação societária dos 4 sócios (**Armando, Flávio, Tripoint e Gustavo**) e convidados técnicos autorizados (ex.: **Contador**):

1. **Comunicação Contextual Durante as Votações (Urna 4/4):**
   Quando um sócio vota `🔴 Solicitar Revisão` ou precisa esclarecer dúvidas sobre uma pauta estratégica, a conversa, a justificativa e os documentos comprobatórios ficam registrados dentro do próprio Painel, vinculados diretamente àquela Pauta.
2. **Canal Oficial para Anexar Documentos Corporativos (Não-Mídia):**
   Torna-se a porta única para anexar qualquer documento jurídico, fiscal, contábil, financeiro, comercial ou fabril (contratos, certidões CNPJ/IE, planilhas de custo, notas fiscais, cotações B2B). Diferente de um formulário frio de upload, a Sala de Reuniões oferece **Assunto + Caixa de Texto Explicativa** para contextualizar o documento, perguntar e obter resposta imediata.
3. **Ergonomia Multi-Tarefa (Popup Flutuante, Móvel e Redimensionável):**
   Permite que o sócio consulte ou preencha uma tabela de valores em qualquer um dos 8 departamentos (`/admin/financeiro`, `/admin/producao`, `/admin/diretoria`, etc.) enquanto conversa ou participa de uma reunião em vídeo, podendo **arrastar a janela livremente**, **redimensioná-la**, ativar o **Modo Fantasma (`👁️` transparência)**, ancorar em **Meia Página (`◫`)** ou **Maximizar (`⛶`)** para vídeo e compartilhamento de tela.

---

## 2. Regras de Negócio e Especificações de UX Homologadas

### 2.1. Novo Topo do Painel em 2 Linhas (2 Cards Horizontais Independentes)
Para eliminar qualquer aperto visual e manter 100% dos itens legíveis:
- **Linha 1 (Card Superior — Comando, Presença & Segurança):**
  1. **Logo Oficial Preta Ampliada (`68px` altura):** `/imagens/AMOSTRAS/LOGOS/LOGO SEM LIMITES PRETO.png` (substituindo o antigo bloco "COCKPIT").
  2. **Card `[ 🚨 CONVOCAR REUNIÃO ]`:** Abre a Sala de Reuniões diretamente no estado de trava obrigatória para criação de nova Pauta.
  3. **Card `[ 💬 SALA DE REUNIÕES ]`:** Alterna a visibilidade da janela flutuante da Sala.
  4. **Espaço de Pessoas Conectadas (`CONECTADOS`):** Exibe as pílulas de presença dos 4 sócios (`🟢 Armando`, `🟢 Flávio`, `🟢 Tripoint`, `🟢 Gustavo`) e, quando ativo, a pílula de convidado externo (`🟢 🔑 Contador (Nível 2)`).
  5. **Ações à Direita (Sem botão redundante de "Centralizar Sala"):** Botão **`🔑 Senha`** (Controle de Senhas em 2 Níveis) + **`↗ Vitrine`** (e ação de saída/sessão).
- **Linha 2 (Card Inferior — Navegação Departamental em Linha Única):**
  - Card horizontal dedicado contendo **`🏛️ Diretoria`** + os **8 Departamentos (`01 · Jurídico` a `08 · Atelier`)** distribuídos com largura uniforme (`flex: 1`), sem quebrar linha.

### 2.2. Obrigatoriedade de "Nomear a Pauta" ao Convocar Reunião / Iniciar Nova Conversa
Para impedir que o chat vire uma lista desorganizada onde não se encontra nada:
- Sempre que um sócio clicar em **`[ 🚨 CONVOCAR REUNIÃO ]`** (ou **`[ + NOVA ]`** dentro da Sala), a **Sala de Reuniões se abre com todas as funções internas desabilitadas (travadas)**.
- No topo da janela surge o banner obrigatório: **`🔒 OBRIGATÓRIO: NOMEAR A PAUTA ANTES DE INICIAR`**.
- O sócio anfitrião deve digitar e gravar o **Nome da Pauta** (que passa a figurar na lista de Pautas e preenche automaticamente o campo **Assunto**).
- Somente após clicar em **`[ Gravar Pauta & Liberar Sala ]`**, os controles de anexo, mensagem e vídeo são liberados.

### 2.3. Dois Fluxos Naturais de Compartilhamento e Reunião
- **Fluxo 1 — Compartilhamento Informacional Assíncrono (Sem Reunião Inicial):**
  O sócio entra sozinho no painel, seleciona a Pauta, anexa o documento (`📎 Anexar Doc`), preenche o texto explicativo, escolhe em **`ANEXAR / ENVIAR PARA`** quem deve ser avisado e clica no botão de envio (**Flecha em 45° para cima `↗`**). Se depois decidir que o documento exige debate ao vivo, clica em **`[ 🚨 Convocar Reunião ]`** direto no card do documento anexado.
- **Fluxo 2 — Convocação de Reunião em Primeiro Lugar:**
  O sócio clica em **`[ 🚨 CONVOCAR REUNIÃO ]`**, a Sala abre, ele grava o **Nome da Pauta**, o sistema convoca os sócios e ele anexa o documento durante a reunião.

### 2.4. Seletor `ANEXAR / ENVIAR PARA:` + Checkbox `"Enviar para mim também"`
- Barra de seleção de destinatários integrada ao compositor da Sala:
  - Opções: **`[ TODOS ]`** | **`[ Flávio ]`** | **`[ Armando ]`** | **`[ Tripoint ]`** | **`[ Gustavo ]`** (+ **`[ 🔑 Convidado Nível 2 ]`** quando conectado, ex.: `🔑 Contador`).
  - **Bloqueio de Auto-Seleção Primária:** O botão do próprio sócio logado fica desabilitado na seleção principal.
  - **Caixinha `☑️ Enviar para mim também`:** Quando marcada, o próprio sócio remetente também recebe no seu WhatsApp/E-mail o protocolo e o alerta do anexo disparado pelo Agente Porteiro.

### 2.5. O Agente "Porteiro do Conselho" (Arauto Societário)
- Atua como secretário executivo automatizado da Sala de Reuniões:
  - A cada documento anexado, mensagem enviada ou reunião convocada, lê o **Assunto / Nome da Pauta**, o **Autor**, o **Arquivo** e os destinatários de **`ANEXAR / ENVIAR PARA`** (incluindo a flag `Enviar para mim também`).
  - Publica instantaneamente na timeline da Sala o **Recibo de Protocolo Oficial**.
  - Dispara a notificação externa (WhatsApp / E-mail) avisando sobre o anexo e seu Assunto.

### 2.6. Controle de Senhas em 2 Níveis de Acesso (`🔑 Senha` — Sócios & Convidados Externos)
O acesso ao Painel exige senha, e o modal do botão **`🔑 Senha`** (com `580px` de largura e botões 100% contidos no card) gerencia **2 Níveis de Acesso para Convidados** (além da senha pessoal do sócio):
- **🔓 Senha Nível 1 (Acesso Somente ao Painel):**
  O convidado acessa o Painel para consulta autorizada, **sem acesso à Sala de Reuniões** e sem voto na Urna.
- **🏛️ Senha Nível 2 (Acesso ao Painel + Sala de Reuniões):**
  Projetado para **Contador, Advogado ou Consultor Especialista**. Com a senha Nível 2, o convidado entra no Painel **e participa da Sala de Reuniões e Compartilhamentos**:
  1. Aparece identificado na barra superior de `CONECTADOS (4+1)` como **`🟢 🔑 Contador (Nível 2)`**;
  2. Aparece automaticamente como opção selecionável na barra **`🎯 ANEXAR / ENVIAR PARA: [ 🔑 Contador ]`** para que os sócios possam anexar documentos diretamente para ele;
  3. Ganha quadro próprio na **Sala de Vídeo** para participar da reunião com os 4 sócios.

### 2.7. Ergonomia Visual e Anti-Quebra de Layout (Regras de CSS Homologadas no Protótipo)
- **Zero Barra de Rolagem Horizontal (`overflow-x: hidden`):** As mensagens e cards de anexos quebram linha automaticamente (`word-break: break-word` e `flex-wrap: wrap`), mantendo os botões **`BAIXAR / ABRIR`** e **`🚨 CONVOCAR REUNIÃO`** sempre 100% dentro do card da mensagem.
- **Palco de Vídeo Compacto em Meia Página:** Quadros de câmera com altura otimizada (`min-height: 112px`) e barra de controles de vídeo (`🎙️ Mic`, `📹 Câmera`, `🖥️ Compartilhar Tela`, `⛶ Maximizar`, `✕ Sair Vídeo`) com `flex: 1 1 auto` e `flex-wrap: wrap` para nunca cortar botões nas bordas laterais.
- **Botão de Envio Compacto com Flecha em 45° para Cima (`↗`):** Botão quadrado preto sólido (`36×36px`) com ícone SVG de flecha inclinada a 45° para cima, maximizando a largura útil da caixa de texto (`msg-input`).

### 2.8. Nova Nomenclatura e Divisão Conceitual dos Departamentos (`05`, `06` e `07`)
Para refletir com precisão o modelo de negócio da AVA Sem Limites (onde quem vende automaticamente 24/7 é a Matriz Canônica do E-commerce e seus Canais integrados):
1. **`05 · SAC` (Titular: Gustavo):**
   - Renomeado de *"Atendimento & SAC"* para apenas **`05 · SAC`** (eliminando o pleonasmo, visto que SAC já significa *Serviço de Atendimento ao Cliente*).
2. **`06 · Marketing de Vendas` (Titular: Gustavo):**
   - Renomeado de *"Vendas, Tráfego & Canais"* para **`06 · Marketing de Vendas`** (*Tráfego & Canais* são atribuições operacionais internas do departamento, não precisam poluir o título).
   - **Missão:** Analisar os KPIs de tráfego e performance comercial, traçar o Plano de Investimentos Estratégicos, convocar reunião na Sala de Reuniões, executar os investimentos aprovados por consenso na Urna 4/4, analisar os resultados e repetir o ciclo (PDCA de Performance).
3. **`07 · Marketing de Produto` (Titular: Tripoint):**
   - Renomeado de *"Marketing & Branding"* para **`07 · Marketing de Produto`**.
   - **Missão:** Criar a estratégia da Coleção, definir o tema das estampas e cuidar da exposição visual da mercadoria (Visual Merchandising), traçando a estratégia visual para o Instagram (Trios 3x3) e para a Vitrine Canônica (que alimenta todos os canais de venda).

### 2.9. Política de Gatilho de Terceirização do SAC ("Cláusula Anti-Sobrecarga do Gustavo")
Para garantir que o titular do `05 · SAC` (**Gustavo**) atue como **Diretor da Pasta** (e nunca fique sobrecarregado com atendimento repetitivo em detrimento do `06 · Marketing de Vendas`):
- **Filtro Primário por IA (95% a 98% de Retenção Automática):** O atendimento rotineiro (dúvidas de tamanho, rastreio J&T Express, cupom `1AVA` a `5AVA`, status de pedido) é resolvido 24/7 pelo **Agente 12 (Concierge IA)** e a triagem técnica de trocas (CDC Art. 49 vs. Defeito Fabril PoD) é pré-instruída pelo **Agente 13 (Discriminador de Ocorrências)**.
- **Gatilho Objetivo de Terceirização (Marca de 5 Atendimentos Humanos):**
  - Quando a demanda de transbordo que exige intervenção humana direta do Gustavo atingir o gatilho de **5 atendimentos humanos recorrentes** (por dia / ciclo operacional, o que equivale a ~130 chamados humanos/mês e um volume estimado de 3.000+ peças vendidas/mês), a AVA Sem Limites aciona a **terceirização da fila humana para um Call Center / Secretariado Compartilhado (BPO)**.
- **Viabilidade e Custo de Mercado Levantados (Brasil):**
  1. **Faixa Inicial / Secretariado Virtual Compartilhado (Ex.: Prestus / Alô Empresa):**
     - *Franquia mínima:* **75 a 150 atendimentos humanos/mês** (~3 a 5 por dia).
     - *Custo mensal:* **R$ 600,00 a R$ 850,00/mês** (~R$ 6,00 a R$ 8,00 por chamado concluído — equivalente ao lucro líquido de apenas ~6 camisetas vendidas no mês).
  2. **Faixa Escala / BPO Especializado em E-commerce (Ex.: InHouse / AfterClick / BCR):**
     - *Franquia mínima:* **500 a 1.000 tickets/mês** (~20 a 35 por dia).
     - *Custo mensal:* **R$ 1.500,00 a R$ 3.500,00/mês** (~R$ 3,50 a R$ 6,00 por ticket).
- **Integração com a Senha Nível 1:**
  - Ao contratar o Call Center / BPO compartilhado, o operador terceirizado recebe uma **Credencial Convidado Nível 1 (`🔑 Senha Nível 1`)**, acessando exclusivamente a fila operacional do Painel sem acesso à Sala de Reuniões dos 4 sócios.

---

## 3. Arquitetura Técnica de Implementação (5 Fases)

### Fase 1 — Modelagem de Dados no PostgreSQL (`prisma/schema.prisma`)
Criação de três tabelas leves e indexadas no banco `ava_vitoria_prod`:

```prisma
model BoardPauta {
  id          String             @id @default(cuid())
  title       String             // Nome obrigatório da Pauta / Assunto
  createdBy   String             // username: armando | flavio | tripoint | gustavo
  status      String             @default("EM_DEBATE") // EM_DEBATE | EM_VOTACAO | HOMOLOGADA | REVISAO
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
  messages    BoardChatMessage[]
}

model BoardChatMessage {
  id               String     @id @default(cuid())
  pautaId          String
  pauta            BoardPauta @relation(fields: [pautaId], references: [id], onDelete: Cascade)
  authorUsername   String     // armando | flavio | tripoint | gustavo | convidado_n2 | porteiro_ia
  authorName       String
  subject          String     // Assunto obrigatório do documento ou mensagem
  content          String?    // Texto explicativo / pergunta
  recipients       String[]   // ["TODOS"] ou ["flavio", "tripoint", "contador_n2"]
  copySender       Boolean    @default(true) // Checkbox "Enviar para mim também"
  attachmentName   String?    // Nome original do arquivo (ex: Certidao_IE_SEFAZ.pdf)
  attachmentUrl    String?    // Rota autenticada (/api/admin/boardroom/files/[id])
  attachmentSize   Int?       // Tamanho em bytes
  attachmentMime   String?    // application/pdf, xlsx, etc.
  isSystemPorteiro Boolean    @default(false)
  createdAt        DateTime   @default(now())
}

model GuestAccessCredential {
  id          String    @id @default(cuid())
  guestName   String    // Ex: "Contador (Contabilidade)"
  accessCode  String    @unique
  accessLevel Int       @default(1) // 1 = Somente Painel | 2 = Painel + Sala de Reuniões
  active      Boolean   @default(true)
  createdBy   String    // Sócio que emitiu a senha
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
}
```

### Fase 2 — APIs Backend & Armazenamento Seguro de Documentos (`src/app/api/admin/boardroom/`)
1. **`POST /api/admin/boardroom/pautas`**:
   - Valida a trava de obrigatoriedade do Nome da Pauta, grava no PostgreSQL e libera a Sala.
2. **`GET & POST /api/admin/boardroom/messages`**:
   - Lista e grava mensagens/anexos por `pautaId` (autorizando os 4 Sócios e Convidados Nível 2; bloqueando Convidados Nível 1).
3. **`POST /api/admin/boardroom/upload` & `GET /api/admin/boardroom/files/[id]`**:
   - Armazena documentos corporativos em diretório protegido na VPS (`/var/www/ava-vitoria/storage/boardroom-docs/`) e entrega via stream autenticado.
4. **`POST /api/admin/boardroom/guest-access`**:
   - Gerencia criação, ativação e revogação de senhas de Convidado Nível 1 e Nível 2.
5. **`POST /api/admin/boardroom/notify` (Motor do Agente Porteiro)**:
   - Registra o protocolo do Agente Porteiro no chat e dispara os avisos externos para os selecionados em `ANEXAR / ENVIAR PARA` (+ remetente, se `copySender === true`).

### Fase 3 — Refatoração do `AdminHeader.tsx` (2 Cards) + Componente Flutuante `BoardroomPopup.tsx`
- Refatoração de [`src/app/admin/AdminHeader.tsx`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/AdminHeader.tsx) e [`src/app/admin/admin-cockpit.module.css`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/admin-cockpit.module.css) para a estrutura de 2 linhas (Linha 1: Logo `LOGO SEM LIMITES PRETO.png` `68px` + `Convocar Reunião` + `Sala de Reuniões` + `Conectados` + `🔑 Senha` + `↗ Vitrine`; Linha 2: `Diretoria` + `8 Departamentos`).
- Criação de `src/app/admin/BoardroomPopup.tsx` e `src/app/admin/boardroom.module.css` com persistência de estado/posição em `localStorage`, controles `👁️ Fantasma`, `▁ Barra Fina`, `◫ Split Lateral`, `⛶ Maximizar` e botão de envio com ícone SVG de flecha em 45° (`↗`).

### Fase 4 — Sala de Vídeo & Compartilhamento de Tela Embutidos
- Integração WebRTC / Jitsi Meet External IFrame API dentro do palco `.videoStage`, suportando os 4 sócios + Convidados Nível 2 com câmera, microfone e compartilhamento de tela em tempo real, sem consumir CPU/banda da VPS Contabo.

### Fase 5 — Integração com a Urna de Votação (`/admin/diretoria`) e Modal de Senhas 2 Níveis
- Conexão direta dos cards de votação da Diretoria com a Sala de Reuniões (abrir conversa/anexos da pauta ou justificar voto de `🔴 Revisão`).
- Evolução do `ChangePasswordModal.tsx` para incluir a aba de emissão de **Senhas de Convidado (Nível 1 e Nível 2)**.

---

## 4. Checklist de Homologação do Planejamento

- [x] Protótipo HTML V5 validado em [`docs/CHAT/prototipo_chat_societario.html`](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/CHAT/prototipo_chat_societario.html).
- [x] Topo em 2 linhas (2 cards) com a logo oficial `LOGO SEM LIMITES PRETO.png` ampliada (`68px`) e sem botão "Centralizar Sala".
- [x] Sistema de Senha em **2 Níveis de Acesso** (`Nível 1: Somente Painel` | `Nível 2: Painel + Sala de Reuniões` para Contador/Consultor, integrando-o automaticamente em `CONECTADOS`, `ANEXAR PARA` e `Vídeo`).
- [x] Trava obrigatória de **Nomear a Pauta** ao convocar reunião / nova conversa.
- [x] Seletor **`ANEXAR / ENVIAR PARA`** + caixinha **`☑️ Enviar para mim também`** + **Agente Porteiro do Conselho**.
- [x] Botão de envio compacto com **Flecha em 45° para cima (`↗`)**, zero barra de rolagem horizontal e botões de vídeo/anexo 100% responsivos em meia página.
