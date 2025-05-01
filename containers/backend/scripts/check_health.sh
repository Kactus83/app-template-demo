#!/bin/sh
# Health check pour le Backend.
# 1. Vérifie que le marqueur indiquant que le serveur est démarré (/deployments/backend/server-started) est présent.
# 2. Vérifie que la route /health renvoie un code de succès.
curl -f http://localhost:${PORT:-3000}/health > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Backend health check failed."
  exit 1
fi

if [ ! -f /deployments/backend/server-started ]; then
  echo "Backend server not started."
  exit 1
fi

exit 0
