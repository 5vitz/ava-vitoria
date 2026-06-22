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

# Fazer o push para o branch main
git push origin main

# Enviar notificação de resultado
if [ $? -eq 0 ]; then
  notify-send "AVA Sem Limites" "Deploy enviado com sucesso para o GitHub/Vercel!"
  # Abre a URL em produção
  xdg-open "https://www.avasemlimites.com.br"
else
  notify-send "AVA Sem Limites" "Erro ao realizar o git push. Verifique o terminal."
fi
