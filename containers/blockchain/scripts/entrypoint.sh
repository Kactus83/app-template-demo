#!/bin/sh

set -e


# Si le premier argument est "compile", on exécute uniquement la compilation
if [ "$1" = "compile" ]; then
  echo "Mode compilation uniquement activé."
  echo "----------------------------------------------------------------------------------------"
  echo "                           🔄 Compilation des contrats (génération des types)..."
  echo "----------------------------------------------------------------------------------------"

  # Exécuter la compilation via Hardhat (qui lancera Typechain)
  npx hardhat compile
  
  echo "----------------------------------------------------------------------------------------"
  echo "      ✅ Compilation terminée, les types ont été générés."
  echo "----------------------------------------------------------------------------------------"
  
  # Fin du container en mode compilation
  exit 0
fi


sleep 3

# Attendre que Vault et la base de données soient initialisés
while [ ! -f /app/deployments/database/initialized ]; do
  sleep 1
done

sleep 2

# Afficher une bannière très visible pour signaler l'initialisation des dépendances
echo " "
echo "======================================================================================================================"
echo "======================================================================================================================"
echo "                     🚀 🚀 🚀 **VAULT ET LA BASE DE DONNÉES SONT INITIALISÉS !** 🚀 🚀 🚀"
echo "======================================================================================================================"
echo "======================================================================================================================"

# Lancer le nœud Hardhat en arrière-plan
npx hardhat node --hostname 0.0.0.0 &

# Attendre que le nœud soit totalement démarré
echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                    ⏳ Attente du démarrage du nœud Hardhat..."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "
sleep 10  # Augmenté pour s'assurer que le nœud est prêt
          # Il faudrait trouver un systeme plus precis

# Compiler les contrats
echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                           🔄 Compilation des contrats..."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "
npx hardhat compile

# Déployer les contrats
echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                         🚀 Déploiement des contrats..."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "
npx hardhat run scripts/deploy.ts --network localhost
sleep 2

# Marquer l'initialisation des contrats Web3
touch /app/deployments/web3/initialized

# Afficher une bannière moins visible pour signaler le déploiement des contrats
echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "      ✅ Contrats déployés, le conteneur reste actif pour les appels au nœud."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "

# Maintenir le conteneur actif après le déploiement
tail -f /dev/null
