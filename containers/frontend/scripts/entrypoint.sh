#!/bin/sh
set -e

# Attente silencieuse jusqu'à ce que le backend soit prêt
until [ -f /app/deployments/backend/server-started ] && curl --fail --silent http://backend:3000/health > /dev/null 2>&1; do
  sleep 1
done

# Attendre 3 secondes supplémentaires pour eviter les conflicts d'affichage
# (les logs du backend mettent du temps a apparaitre)
sleep 3

echo "✅ Backend opérationnel (health-check OK)."

echo "🔄 Vérification du dossier de build Angular..."
ls -la /usr/share/nginx/html

echo "🚀 Lancement de Nginx..."
# Lancer Nginx en mode "daemon off" en arrière-plan
nginx -g "daemon off;" &
NGINX_PID=$!

echo "🔄 Attente que Nginx réponde sur le port 4200..."
# Dans cet exemple, nous supposons que Nginx est configuré pour écouter sur le port 4200.
# Vous pouvez ajuster le port (ou utiliser le port 80) selon votre configuration.
until curl --fail --silent http://localhost:4200/ > /dev/null 2>&1; do
  sleep 1
done

echo "✅ Frontend opérationnel."
mkdir -p /app/deployments/frontend
touch /app/deployments/frontend/initialized

echo "🔒 Frontend est prêt. Attente du processus Nginx..."
# Attendre indéfiniment sur le processus Nginx pour ne pas quitter le conteneur
wait $NGINX_PID
