#!/bin/bash
# ============================================================
#  Déploiement AUTOMATIQUE du site OPTINET (serveur DietPi4)
#  Lancé toutes les 2 min par cron.
#  - ne déploie que s'il y a un commit non encore déployé
#  - réessaie tant que le déploiement n'a pas réussi
#  - rollback automatique si le conteneur ne démarre pas
#  - écrit un "battement de coeur" à chaque passage
# ============================================================
set -uo pipefail

REPO=/home/hugue/optinet_build
MEDIA=/home/hugue/optinet_media
LOG=/home/hugue/optinet-deploy.log
HEARTBEAT=/home/hugue/optinet-deploy.last     # preuve que le cron tourne
DEPLOYED=/home/hugue/optinet-deployed.sha     # dernier commit DÉPLOYÉ AVEC SUCCÈS
LOCK=/tmp/optinet-deploy.lock

# Empêche deux déploiements simultanés (log si déjà en cours)
exec 9>"$LOCK"
flock -n 9 || { echo "$(date) : deploiement deja en cours, on saute" >> "$LOG"; exit 0; }

# Battement de coeur (prouve que le script est bien exécuté par cron)
date -u '+%Y-%m-%d %H:%M:%S UTC' > "$HEARTBEAT"

cd "$REPO" || { echo "$(date) : REPO introuvable ($REPO)" >> "$LOG"; exit 1; }

# Récupère l'état distant ; si le fetch échoue, on LOGUE (au lieu de sortir en silence)
if ! git fetch --quiet origin main 2>>"$LOG"; then
  echo "$(date) : git fetch ECHEC (reseau ?) — on reessaiera" >> "$LOG"
  exit 1
fi

REMOTE=$(git rev-parse origin/main)
LAST=$(cat "$DEPLOYED" 2>/dev/null || echo "none")
[ "$REMOTE" = "$LAST" ] && exit 0   # déjà déployé avec succès -> rien à faire

echo "==================================================" >> "$LOG"
echo "$(date) : nouveau code $REMOTE (dernier deploye: $LAST)" >> "$LOG"
git reset --hard --quiet "$REMOTE" >> "$LOG" 2>&1

# Sauvegarde des médias (1 copie précédente)
rm -rf "${MEDIA}_prev"
cp -r "$MEDIA" "${MEDIA}_prev" 2>/dev/null || true

# Construction — si elle échoue, on NE marque PAS comme déployé -> retry au prochain passage
if ! docker build -f Dockerfile -t optinet:new . >> "$LOG" 2>&1; then
  echo "$(date) : ECHEC du build — nouvelle tentative au prochain cycle" >> "$LOG"
  exit 1
fi

# Bascule (on garde l'ancien conteneur en secours)
docker rm -f optinet_old >/dev/null 2>&1 || true
docker stop optinet    >/dev/null 2>&1 || true
docker rename optinet optinet_old >/dev/null 2>&1 || true
docker run -d --name optinet --network optinet -p 8000:8000 --restart unless-stopped \
  -v "$MEDIA":/app/media optinet:new >> "$LOG" 2>&1

# Vérifie le démarrage ; rollback automatique sinon (et pas de marquage -> retry)
sleep 8
if [ "$(docker inspect -f '{{.State.Running}}' optinet 2>/dev/null)" != "true" ]; then
  echo "$(date) : le conteneur n'a pas demarre -> ROLLBACK" >> "$LOG"
  docker rm -f optinet >/dev/null 2>&1 || true
  docker rename optinet_old optinet >/dev/null 2>&1 || true
  docker start optinet >/dev/null 2>&1 || true
  exit 1
fi

# Succès : on mémorise le commit déployé
echo "$REMOTE" > "$DEPLOYED"
echo "$(date) : ✅ deploiement reussi ($REMOTE)" >> "$LOG"
