# Réplica de leitura: mesmo Postgres, entrypoint que clona do primary e inicia em standby
FROM postgres:15
COPY replica-entrypoint.sh /replica-entrypoint.sh
RUN chmod +x /replica-entrypoint.sh
ENTRYPOINT ["/replica-entrypoint.sh"]
CMD ["postgres"]
