# TASK-001: Criar Ícone e Script para Deploy Completo

## 📋 Status
*   **Status:** Pendente / Backlog
*   **Prioridade:** Alta (Ideia Inicial)
*   **Data de Criação:** 2026-06-07
*   **Autor:** Genera (Armando)
*   **Responsável:** Lincoln (Orquestrador Geral)

---

## 🔍 Descrição da Necessidade

Replicar o fluxo automatizado do projeto anterior (Killer Skills) para o e-commerce **AVA Vitória**. O objetivo é criar um atalho visual (ícone com a logo da marca) no sistema operacional do Genera que, ao ser clicado, execute um script local de deploy e verificação sem necessidade de comandos manuais no terminal.

---

## ⚡ Comportamento Esperado do Script

Ao acionar o atalho, o script em segundo plano deve realizar os seguintes passos na sequência:

1.  **Sincronização Remota (GitHub):**
    *   Executar o `git push origin main` (ou branch ativa) para garantir que o código local mais recente seja enviado ao backup remoto no GitHub.
2.  **Deploy na VPS (Contabo):**
    *   Estabelecer conexão SSH segura ou disparar um webhook/script na VPS Contabo para puxar as alterações mais recentes e reiniciar o servidor web local (PM2, systemd ou similar).
3.  **Verificação Visual:**
    *   Abrir uma nova aba no navegador Firefox apontando para a URL pública do e-commerce da AVA Vitória para validar o deploy em produção em tempo real.

---

## 🛠️ Requisitos Técnicos de Implementação

*   **Script de Automação:** Um script bash (`.sh`) executável localizado na pasta do projeto (ex: `scripts/deploy.sh`).
*   **Arquivo do Lançador:** Um arquivo de configuração de desktop Linux (`.desktop`) apontando para o script bash.
*   **Identidade Visual:** Usar a imagem de logo da AVA Vitória como o ícone do lançador (`.desktop`).
*   **Configurações de Acesso:** SSH Keys configuradas previamente no computador local do Genera autorizadas na VPS Contabo para evitar digitação de senha durante o processo automático.
