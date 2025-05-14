#!/bin/sh

sleep 10

set -e

# Attendre que toutes les dépendances soient initialisées
check_dependencies() {
  [ -f /app/deployments/database/initialized ] &&
  [ -f /app/deployments/web3/initialized ] &&
  [ -f /app/deployments/mailhog/initialized ]
}

echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                        🚀 🚀 🚀 **ATTENTE DES DÉPENDANCES...** 🚀 🚀 🚀"
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "

# Boucle d'attente silencieuse jusqu'à l'initialisation complète des dépendances
until check_dependencies; do
  sleep 2
done


# (Optionnel) Afficher le contenu du dossier /app/deployments/docs :
echo "Deplacement de la documentation dans le volume monté "
cp -r /app/docs /app/deployments/backend/

# Afficher une grande bannière très visible pour signaler l'initialisation complète
echo " "
echo "======================================================================================================================"
echo "======================================================================================================================"
echo "                        🚀 🚀 🚀 **TOUTES LES DÉPENDANCES SONT INITIALISÉES !** 🚀 🚀 🚀"
echo "======================================================================================================================"
echo "======================================================================================================================"

# Exécuter les migrations Prisma 
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                      🔄 Exécution des migrations Prisma..."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "

# Pour la premiere init
npx prisma migrate dev --name init
npx prisma migrate deploy

# Pour les migrations suivantes en cas de reset total de la base de données
# npx prisma migrate reset --force

# Afficher une bannière moins imposante avant de démarrer l'application
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                         ⚙️ Démarrage de l'application..."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "

# Marquer le backend comme en cours de lancement
touch /app/deployments/backend/server-started
# C'est le script de deploiement qui pose le marqueur de l'initialisation du backend après avoir vérifié que le route health fonctionne


# Démarrer l'application NestJS
node dist/src/main.js
