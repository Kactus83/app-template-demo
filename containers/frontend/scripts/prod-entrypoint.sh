#!/bin/sh
set -e

echo "✅ Backend opérationnel (health-check OK)."

echo "🔄 Vérification du dossier de build Angular..."
ls -la /usr/share/nginx/html

echo "🚀 Lancement de Nginx (foreground)…"

# Nginx reste en PID 1, container gardera le process en vie
nginx -g "daemon off;"