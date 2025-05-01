#!/bin/sh
# Health check pour le Frontend.
# 1. Vérifie que le marqueur d'initialisation (/deployments/frontend/initialized) est présent.
# 2. Utilise curl pour confirmer que l'application est accessible sur le port 4200.
if [ ! -f /deployments/frontend/initialized ]; then
  echo "Frontend not initialized."
  exit 1
fi

curl -f http://localhost:4200 > /dev/null 2>&1
exit $?
