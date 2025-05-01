#!/bin/bash

set -e

sleep 1

# Afficher une bannière très visible pour signaler l'initialisation de Vault
echo " "
echo "======================================================================================================================"
echo "======================================================================================================================"
echo "                 🔐 🔐 🔐  DÉMARRAGE DE LA BASE DE DONNÉES.** 🔐 🔐 🔐"
echo "======================================================================================================================"
echo "======================================================================================================================"
echo " "
echo " "

# Lancer PostgreSQL en arrière-plan
docker-entrypoint.sh postgres &

sleep 7

# Attendre que PostgreSQL soit prêt
until pg_isready -h localhost -p 5432 > /dev/null 2>&1; do
  sleep 1
done

# Afficher un message indiquant que PostgreSQL est prêt
echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                              ✅ PostgreSQL est prêt !"
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "

# Marquer l'initialisation
touch /deployments/database/initialized

# Maintenir le conteneur actif
wait
