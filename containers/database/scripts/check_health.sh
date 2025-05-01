#!/bin/bash
# Health check pour PostgreSQL.
# 1. Vérifie que le marqueur d'initialisation (/deployments/database/initialized) est présent.
# 2. Utilise pg_isready pour confirmer la disponibilité de la base.

if [ ! -f /deployments/database/initialized ]; then
  echo "Database not initialized."
  exit 1
fi

pg_isready -h localhost -p 5432 > /dev/null 2>&1
exit $?
