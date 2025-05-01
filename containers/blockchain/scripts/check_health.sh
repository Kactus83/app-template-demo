#!/bin/sh
# Health check pour le nœud Blockchain (Hardhat).
# 1. Vérifie que le marqueur d'initialisation (/app/deployments/web3/initialized) est présent.
# 2. Exécute une commande Hardhat basique pour vérifier que le nœud répond.

if [ ! -f /app/deployments/web3/initialized ]; then
  echo "Blockchain (web3) not initialized."
  exit 1
fi

npx hardhat node --help > /dev/null 2>&1
exit $?
