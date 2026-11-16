#!/usr/bin/env bash
# Backup diario de MySQL. Guarda los últimos 14 días en deploy/backups/.
# Cron (crontab -e):  0 3 * * * /home/ubuntu/rcv-daspu/deploy/backup.sh
set -euo pipefail
cd "$(dirname "$0")"
set -a; source .env; set +a
mkdir -p backups
docker compose exec -T db mysqldump -uroot -p"$DB_ROOT_PASSWORD" --single-transaction --routines "$DB_NAME" \
  | gzip > "backups/rcv-$(date +%F).sql.gz"
find backups -name '*.sql.gz' -mtime +14 -delete
