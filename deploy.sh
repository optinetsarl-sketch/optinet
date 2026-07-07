#!/bin/bash
# ============================================================
#  Déploiement AUTOMATIQUE du site OPTINET (serveur DietPi4)
#  Lancé toutes les 2 min par cron. Ne fait rien s'il n'y a
#  pas de nouveau code. Sinon : build + bascule + rollback auto.
# ============================================================
set -uo pipefail

REPO=/home/hugue/optinet_build
MEDIA=/home/hugue/optinet_media
LOG=/home/hugue/optinet-deploy.log
LOCK=/tmp/optinet-deploy.lock

# Empêche deux déploiements simultanés
exec 9>"$LOCK"
flock -n 9 || exit 0

cd "$REPO" || exit 1

# Y a-t-il du nouveau code sur GitHub ?
git fetch --quiet origin main || exit 0
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
[ "$LOCAL" = "$REMOTE" ] && exit 0   # rien de nouveau -> on sort

echo "==================================================" >> "$LOG"
echo "$(date) : nouveau code détecté ($REMOTE) — déploiement" >> "$LOG"

git reset --hard --quiet origin/main >> "$LOG" 2>&1

# Sauvegarde des médias (garde 1 copie précédente)
rm -rf "${MEDIA}_prev"
cp -r "$MEDIA" "${MEDIA}_prev" 2>/dev/null || true

# Construction de la nouvelle image
if ! docker build -f Dockerfile -t optinet:new . >> "$LOG" 2>&1; then
  echo "$(date) : ECHEC du build — site inchangé" >> "$LOG"
  exit 1
fi

# Bascule (on garde l'ancien conteneur en 'optinet_old' pour rollback)
docker rm -f optinet_old >/dev/null 2>&1 || true
docker stop optinet    >/dev/null 2>&1 || true
docker rename optinet optinet_old >/dev/null 2>&1 || true
docker run -d --name optinet --network optinet -p 8000:8000 --restart unless-stopped \
  -v "$MEDIA":/app/media optinet:new >> "$LOG" 2>&1

# Vérifie que le nouveau conteneur tourne ; sinon ROLLBACK automatique
sleep 8
if [ "$(docker inspect -f '{{.State.Running}}' optinet 2>/dev/null)" != "true" ]; then
  echo "$(date) : le nouveau conteneur n'a pas démarré -> ROLLBACK" >> "$LOG"
  docker rm -f optinet >/dev/null 2>&1 || true
  docker rename optinet_old optinet >/dev/null 2>&1 || true
  docker start optinet >/dev/null 2>&1 || true
  exit 1
fi

echo "$(date) : ✅ déploiement réussi ($REMOTE)" >> "$LOG"
