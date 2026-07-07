#!/bin/bash
echo "🚀 INICIANDO DEPLOY AUTOMÁTICO — AVA SEM LIMITES (CONTABO)"
echo "------------------------------------------------------------"

# Notificação local de início
if command -v notify-send >/dev/null 2>&1; then
    notify-send "AVA Sem Limites" "Iniciando deploy automático na Contabo..."
fi

# 1. Carrega as variáveis do arquivo .env local
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "📦 1. Enviando alterações locais para o GitHub..."
git add .
if ! git diff-index --quiet HEAD --; then
    git commit -m "deploy: automatic sync $(date '+%Y-%m-%d %H:%M:%S')"
else
    echo "ℹ️ Nenhuma alteração pendente para commitar."
fi

if [ ! -z "$GITHUB_TOKEN" ]; then
    echo "🔑 Autenticando com Token do GitHub..."
    git push https://$GITHUB_TOKEN@github.com/5vitz/ava-vitoria.git main
    if [ $? -ne 0 ]; then
        echo "❌ ERRO: Falha ao enviar alterações para o GitHub. Verifique se há conflitos!"
        if command -v notify-send >/dev/null 2>&1; then
            notify-send "AVA Sem Limites" "Erro no git push. Verifique o terminal."
        fi
        exit 1
    fi
else
    echo "⚠️ GITHUB_TOKEN não configurado no .env! Tentando push padrão..."
    git push
    if [ $? -ne 0 ]; then
        echo "❌ ERRO: Falha ao enviar alterações para o GitHub. Configure o GITHUB_TOKEN!"
        if command -v notify-send >/dev/null 2>&1; then
            notify-send "AVA Sem Limites" "Erro no git push. Configure o GITHUB_TOKEN."
        fi
        exit 1
    fi
fi

echo "🖥️ 2. Conectando via SSH à VPS Contabo e atualizando o site..."

# Função de conexão inteligente que automatiza o SSH com senha se VPS_PASSWORD existir
connect_ssh() {
  if [ ! -z "$VPS_PASSWORD" ]; then
      # Garante que o sshpass esteja instalado localmente
      if ! command -v sshpass >/dev/null 2>&1; then
          echo "🔄 Instalando sshpass localmente para automação de senha..."
          sudo apt-get install -y sshpass || true
      fi
      sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no root@31.220.102.2 "$@"
  else
      ssh root@31.220.102.2 "$@"
  fi
}

connect_ssh << 'EOF'
  # Verifica se a pasta ~/ava-vitoria existe na VPS, senão clona
  if [ ! -d "/root/ava-vitoria" ]; then
      echo "📦 Clonando repositório ava-vitoria na VPS..."
      git clone https://github.com/5vitz/ava-vitoria.git /root/ava-vitoria || { echo "❌ ERRO: Falha ao clonar repositório!"; exit 1; }
  fi

  cd /root/ava-vitoria || { echo "❌ ERRO: Pasta /root/ava-vitoria não encontrada na VPS!"; exit 1; }
  
  # Força a atualização do repositório
  git reset --hard
  git pull || { echo "❌ ERRO: Falha ao rodar git pull no VPS!"; exit 1; }
  
  # Criar ou atualizar o arquivo .env de produção na VPS
  echo "📝 Configurando arquivo .env de produção na VPS..."
  cat << 'ENV' > .env
DATABASE_URL="postgresql://ava_vitoria_user:AvaVitoriaSecretPass!@localhost:5432/ava_vitoria_prod?schema=public"
NEXTAUTH_SECRET="f6c8d76d4001cbe13658514101e52dbbfa9796e6"
NEXTAUTH_URL="https://www.ava-vitoria.com.br"
ENV

  # Carrega variáveis de ambiente comuns para garantir que o PM2 e Node sejam localizados
  export PATH=$PATH:/usr/local/bin:/usr/bin:/root/.nvm/versions/node/*/bin
  [ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"
  [ -s "$HOME/.profile" ] && \. "$HOME/.profile"
  [ -s "$HOME/.bashrc" ] && \. "$HOME/.bashrc"
  
  # Instalar dependências npm
  echo "📦 Instalando dependências npm na VPS..."
  npm install || { echo "❌ ERRO: Falha ao rodar npm install no VPS!"; exit 1; }

  # Sincronizar o banco de dados via Prisma
  echo "⚡ Executando migrações do banco de dados (Prisma)..."
  npx prisma db push || { echo "❌ ERRO: Falha ao rodar prisma db push no VPS!"; exit 1; }
  
  # Compilar Next.js
  echo "📦 Compilando aplicação Next.js (Build)..."
  npm run build || { echo "❌ ERRO: Falha ao rodar npm run build no VPS!"; exit 1; }
  
  # Reiniciar serviço no PM2
  echo "🔄 Iniciando/Reiniciando serviço Next.js com PM2..."
  pm2 restart ava-vitoria --update-env || pm2 start npm --name "ava-vitoria" -- start || {
      echo "❌ ERRO: Falha ao gerenciar processo PM2!"; exit 1;
  }
  
  echo "✅ DEPLOY CONCLUÍDO COM SUCESSO NA VPS CONTABO!"
EOF

# Notificação local de conclusão e abertura de navegador
if [ $? -eq 0 ]; then
  if command -v notify-send >/dev/null 2>&1; then
    notify-send "AVA Sem Limites" "Deploy concluído com sucesso na Contabo!"
  fi
  # Abre o site oficial seguro
  firefox "https://www.ava-vitoria.com.br" &
else
  if command -v notify-send >/dev/null 2>&1; then
    notify-send "AVA Sem Limites" "Erro durante o deploy da Contabo. Verifique os logs."
  fi
fi

# Se o script estiver rodando em um terminal interativo (ex: duplo clique no atalho), aguarda o Enter
if [ -t 0 ]; then
  echo ""
  read -p "Pressione [Enter] para fechar esta janela..."
fi
