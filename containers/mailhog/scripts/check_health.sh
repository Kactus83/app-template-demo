#!/bin/sh
# Health check pour Mailhog.
# 1. Vérifie que le marqueur d'initialisation (/deployments/mailhog/initialized) est présent.
# 2. Utilise curl pour vérifier l'accessibilité de l'interface Web de Mailhog sur le port 8025.

if [ ! -f /deployments/mailhog/initialized ]; then
  echo "Mailhog not initialized."
  exit 1
fi

curl -f http://localhost:8025 > /dev/null 2>&1
exit $?
