#!/bin/bash
set -e
# Cria usuário de replicação (usado pelo standby para receber o stream do primary)
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE USER replicator WITH REPLICATION PASSWORD '${REPLICATION_PASSWORD}';
EOSQL
# Permite conexões de replicação do container do standby (rede Docker)
echo "host replication replicator 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" -c "SELECT pg_reload_conf();"
