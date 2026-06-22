#!/bin/bash
# Script de deploy automatizado em 1 clique para AVA Sem Limites
# -------------------------------------------------------------

# Navegar para o diretório do projeto
cd "/home/artz/Documentos/Antigravity/Ava-Vitoria" || exit

# Notificar início do processo
notify-send "AVA Sem Limites" "Iniciando deploy automático..."

# Adicionar todas as alterações
git add .

# Commitar com timestamp
COMMIT_MSG="auto-deploy: $(date '+%d/%m/%Y %H:%M:%S')"
git commit -m "$COMMIT_MSG"

# Extrair token do arquivo .env
TOKEN=$(sed -n 's/^GITHUB_TOKEN=//p' .env | tr -d '\r\n ')

# Fallback se não achar no .env, tenta na pasta pai
if [ -z "$TOKEN" ] && [ -f "../Token_GitHub.txt" ]; then
  TOKEN=$(cat ../Token_GitHub.txt | tr -d '\r\n ')
fi

# Faz o push autenticado de forma transparente
if [ -n "$TOKEN" ]; then
  git push "https://$TOKEN@github.com/5vitz/ava-vitoria.git" main
else
  git push origin main
fi

# Abre no Firefox após conclusão e envia notificação
if [ $? -eq 0 ]; then
  notify-send "AVA Sem Limites" "Deploy enviado com sucesso para o GitHub/Vercel!"
  firefox "https://www.avasemlimites.com.br" &
else
  notify-send "AVA Sem Limites" "Erro ao realizar o git push. Verifique o terminal."
fi
