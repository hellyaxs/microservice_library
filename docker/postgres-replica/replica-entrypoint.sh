#!/bin/bash
set -e

# Só faz o clone do primary se o diretório de dados ainda não foi inicializado
if [ ! -f "$PGDATA/PG_VERSION" ]; then
  echo "Aguardando o primary (database) ficar pronto..."
  until PGPASSWORD="$REPLICATION_PASSWORD" pg_isready -h "$REPLICATION_PRIMARY_HOST" -p "${REPLICATION_PRIMARY_PORT:-5432}" -U replicator 2>/dev/null; do
    sleep 2
  done
  echo "Clonando dados do primary (pg_basebackup)..."
  PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup -h "$REPLICATION_PRIMARY_HOST" -p "${REPLICATION_PRIMARY_PORT:-5432}" -D "$PGDATA" -U replicator -X stream -R
  echo "Réplica inicializada. Iniciando PostgreSQL em modo standby."
fi

exec /usr/local/bin/docker-entrypoint.sh "$@"
