# 📍 Protocolo de Passagem de Bastão (Handover) — AVA Sem Limites

Este documento é a nossa âncora de persistência para as sessões de planejamento e codificação. Ele deve ser lido no início de cada sessão e atualizado ao final.

---

## 1. O que realizamos nesta sessão (Estado Atual)

*   **Migração Completa para a VPS Contabo (`31.220.102.2`) ✅:**
    *   **Banco de Dados PostgreSQL:** Instalamos e ativamos o PostgreSQL nativo na VPS. Criamos o banco `ava_vitoria_prod` e usuário `ava_vitoria_user` com a senha secreta do projeto.
    *   **Sincronização e Seed:** Rodamos o Prisma Migrations para criar a estrutura e semeamos o banco (`npx tsx prisma/seed.ts` via tsx) gerando o administrador padrão, Design System padrão, produtos, coleções e variantes.
    *   **Redefinição de Mídias:** Atualizamos as imagens dos produtos da coleção da vitrine para lerem a pasta local `/imagens/VITRINE/SemLimites/...` na VPS.
*   **Domínio e HTTPS (SSL) Ativados ✅:**
    *   O domínio `ava-vitoria.com.br` e o subdomínio `www.ava-vitoria.com.br` foram apontados no Registro.br para o IP da VPS (`31.220.102.2`).
    *   Instalamos o certificado SSL gratuito via **Certbot (Let's Encrypt)** na VPS, configurando o Nginx para forçar todo o tráfego a rodar sobre HTTPS de forma nativa e segura.
    *   **NEXTAUTH_URL:** A URL de segurança da sessão de login administrativa foi devidamente atualizada para o domínio seguro `https://www.ava-vitoria.com.br` no `.env` de produção.
*   **Automação e Atalho do Deploy ✅:**
    *   **Script de Deploy:** O script local [deploy.sh](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/scripts/deploy.sh) commita e dá push no GitHub, acessa a VPS via SSH (usando `sshpass` com a senha segura em `.env`), atualiza o código, instala pacotes, sincroniza o banco, builda o Next.js e reinicia o processo PM2 (`ava-vitoria`) recarregando as variáveis com `--update-env`.
    *   **Atalho de Área de Trabalho:** Criamos o atalho executável [Deploy-AVA.desktop](file:///home/artz/%C3%81rea%20de%20trabalho/Deploy-AVA.desktop) na Área de Trabalho com a logomarca da AVA Vitória. Ao clicar duas vezes, ele abre um terminal interativo executando todo o deploy e abrindo a página no Firefox ao final.
*   **Exclusão de Projetos (Coleções) no Painel ✅:**
    *   Desenvolvemos a Server Action `deleteCollectionAction` no final de [actions.ts](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/grid-manager/actions.ts).
    *   Integramos o botão `×` vermelho no cabeçalho de cada card de projeto no [DashboardClient.tsx](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/DashboardClient.tsx), estilizado no [dashboard.module.css](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/src/app/admin/dashboard.module.css). Ele conta com confirmação de segurança e `e.stopPropagation()` para não abrir a coleção ao excluir.
*   **Desativação de Serviços Externos ✅:**
    *   O usuário removeu o projeto na Vercel e deletou o banco de dados na Neon. A aplicação agora é **100% autônoma e descentralizada na VPS Contabo**.

---

## 2. 🖥️ Informações do Ambiente de Produção

*   **URL da Loja:** `https://www.ava-vitoria.com.br`
*   **URL do Painel Admin:** `https://www.ava-vitoria.com.br/admin`
*   **Credenciais Padrão:**
    *   **Usuário:** `admin`
    *   **Senha:** `admin123`
*   **Banco de Dados na VPS:** `postgresql://ava_vitoria_user:AvaVitoriaSecretPass!@localhost:5432/ava_vitoria_prod?schema=public`
*   **Next.js PM2 Process Name:** `ava-vitoria` (porta 3000)

---

## 3. Próximos Passos Imediatos (Para o próximo Lincoln)

1.  **Testar Upload de Imagens no Painel:** Como a VPS tem o sistema de arquivos 100% gravável, valide a criação de novos produtos e o upload de fotos de vitrine pela biblioteca administrativa.
2.  **Mapear Fluxo de E-commerce:** Validar se a sacolinha do Instagram e as rotas de checkout estão lendo as APIs do novo domínio dinâmico (`https://www.ava-vitoria.com.br/api/catalog/meta`).
3.  **Segurança e Backup:** Acompanhar com o proprietário a contratação do serviço de backup automático da VPS (Contabo) para resguardar o banco de dados local.
