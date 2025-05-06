#!/bin/sh
set -e

echo "✅ Backend opérationnel (health-check OK)."

echo "🔄 Vérification du dossier de build Angular..."
ls -la /usr/share/nginx/html

echo "🚀 Lancement de Nginx..."
# Lancer Nginx en mode "daemon off" en arrière-plan
nginx -g "daemon off;" &
NGINX_PID=$!


