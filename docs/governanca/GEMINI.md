# GEMINI.md

Diretrizes comportamentais e regras de governança para o desenvolvimento do ecossistema Killer Skills. Este manifesto deve ser lido e respeitado em todas as sessões e execuções de tarefas.

---

## 🧠 1. Pense Antes de Codificar (Think Before Coding)

**Não presuma. Não esconda confusão. Explique os tradeoffs.**

Antes de realizar qualquer alteração física no código:
- Declare suas suposições de forma explícita. Se estiver incerto sobre alguma regra de negócio ou lógica legada, pare e pergunte ao Genera no chat.
- Se existirem múltiplas formas de implementar uma alteração, apresente-as no chat com seus respectivos impactos (tempo vs. complexidade). Não decida em silêncio.
- Se encontrar uma abordagem muito mais simples que a solicitada, sugira-a. Evite o excesso de engenharia.

---

## ⚡ 2. Simplicity First (Simplicidade Primeiro)

**Escreva o menor código possível que resolva o problema. Nada de especulativo.**

- Não implemente funcionalidades adicionais além do que foi estritamente solicitado no prompt da tarefa.
- Não crie abstrações, classes ou helpers para trechos de código que serão usados uma única vez.
- Não adicione configurações ou campos no banco de dados "just in case" (prevendo um uso futuro hipotético).
- Confie nos fluxos e tratamentos do framework. Evite código defensivo para cenários logicamente impossíveis.

---

## 🪡 3. Mudanças Cirúrgicas (Surgical Changes)

**Altere apenas o necessário. Limpe apenas a sujeira que você criou.**

Ao editar arquivos de código existentes:
- Não tente "melhorar" ou refatorar o código, comentários ou a formatação de trechos adjacentes que não fazem parte do escopo da tarefa.
- Siga rigorosamente o padrão estético, espaçamento e convenções de nomenclatura do arquivo original, mesmo que você faria diferente.
- Se encontrar um código adjacente muito ruim ou morto que precise de limpeza, **não altere no mesmo diff**. Registre como uma tarefa de sugestão para uma futura sessão de refatoração isolada.

---

## 🔒 4. Restrições Estritas do Ecossistema Killer Skills

- **PROIBIDO O USO DE GREP:** A ferramenta `grep` do chat está banida por causar travamento do console do Antigravity. Realize pesquisas por meio de caminhos de arquivos diretos, comandos leves de shell ou listagens cirúrgicas de diretórios.
- **DEPLOY EXCLUSIVO DO GENERA:** Não execute comandos de `git push` ou scripts de deploy para o servidor VPS. O deploy em produção é de soberania exclusiva do Genera, realizado após a homologação das alterações locais.
- **ESTÉTICA DA SUBTRAÇÃO:** As interfaces em React devem seguir a Estética da Subtração: linhas finas de borda (1px), fontes leves (`Poppins 200` ou `Poppins-light`), ausência de negritos excessivos e paleta de cores Tailored (HSL/RGB escuros premium).
- **INTEGRIDADE DO VALIDADO:** Nada que já esteja funcionando e homologado pelo Genera (como transições de tela, live preview, cálculo de créditos) pode ser modificado ou quebrado a menos que haja solicitação expressa.
