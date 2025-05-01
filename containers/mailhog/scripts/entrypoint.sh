#!/bin/sh

set -e

# Créer le dossier de stockage des données si nécessaire
mkdir -p /deployments/mailhog

# Si on est root, ajuster les permissions et redescendre aux privilèges 999:999
if [ "$(id -u)" = "0" ]; then
  echo "Ajustement des permissions sur /deployments..."
  chown -R 999:999 /deployments/mailhog || echo "Avertissement : chown échoué"
  chmod -R 775 /deployments/mailhog || echo "Avertissement : chmod échoué"
  echo "Redescente aux privilèges de l'utilisateur 999..."
  exec su-exec 999:999 "$0" "$@"
fi

sleep 3

# Attendre que les contrats Web3, la base de données et Vault soient initialisés
while [ ! -f /deployments/web3/initialized ] || [ ! -f /deployments/database/initialized ]; do
  sleep 1
done

sleep 2

# Afficher une bannière très visible pour signaler l'initialisation des dépendances
echo " "
echo "======================================================================================================================"
echo "======================================================================================================================"
echo "          📧 📧 📧 **VAULT, LA BASE DE DONNÉES ET LES CONTRATS WEB3 SONT INITIALISÉS !** 📧 📧 📧"
echo "======================================================================================================================"
echo "======================================================================================================================"

# Lancer MailHog en arrière-plan
MailHog &

# Attendre que MailHog soit prêt
echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                        ⏳ Attente que MailHog soit prêt..."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "

while ! nc -z localhost 1025; do
  sleep 1
done

# Marquer l'initialisation
touch /deployments/mailhog/initialized

# Afficher une bannière moins visible pour signaler le déploiement de MailHog
echo " "
echo " "
echo "----------------------------------------------------------------------------------------"
echo "                       ✅📧 MailHog déployé et opérationnel."
echo "----------------------------------------------------------------------------------------"
echo " "
echo " "

# Maintenir le conteneur actif
wait
