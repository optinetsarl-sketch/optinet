# Dockerisation du projet OPTINET

## Contexte
Ce projet contient deux applications séparées :
- backend Django dans `backend/`
- frontend React/Vite dans `frontend/`

L’objectif est de pouvoir lancer les deux services en développement et en production via Docker.

## Fichiers ajoutés

### Backend
- `backend/Dockerfile`
  - Base : `python:3.12-slim`
  - Installe les dépendances depuis `backend/requirements.txt`
  - Exécute les migrations puis lance le serveur Django sur `0.0.0.0:8000`
- `backend/Dockerfile.prod`
  - Même base que le Dockerfile dev
  - Exécute les migrations, collecte les fichiers statiques et démarre `gunicorn`
- `backend/requirements.txt`
  - Ajout de `Django==5.2.11`
  - Ajout de `gunicorn==22.2.0`
- `backend/backend/settings.py`
  - `DEBUG` prend la valeur de `DJANGO_DEBUG`
  - `ALLOWED_HOSTS` prend la valeur de `DJANGO_ALLOWED_HOSTS`
  - `STATIC_ROOT` configuré pour `collectstatic`
- `backend/.dockerignore`
  - Ignorer `__pycache__`, `*.pyc`, `db.sqlite3`, `.env`, `.git`

### Frontend
- `frontend/Dockerfile`
  - Base : `node:20-alpine`
  - Installe les dépendances et lance Vite en développement sur `0.0.0.0:5173`
- `frontend/Dockerfile.prod`
  - Build du projet avec Vite
  - Serve le build avec un serveur Node léger
- `frontend/.dockerignore`
  - Ignorer `node_modules`, `dist`, `build`, `.vite`, `.env`, logs, `.git`

### Compose
- `docker-compose.yml`
  - Service `backend` en dev exposé sur le port `8000`
  - Service `frontend` en dev exposé sur le port `5173`
- `docker-compose.prod.yml`
  - Service `backend` en production sur le port `8000`
  - Service `frontend` en production sur le port `80`
  - Le frontend dépend du backend

### Racine
- `.dockerignore`
  - Ignorer `venv`, `__pycache__`, `*.pyc`, `node_modules`, `dist`, `build`, `.DS_Store`, `.git`

## Commandes utiles

### Construire les images Docker de production
```bash
cd /home/star/Desktop/OPTINET
sh build-docker-images.sh
```

### Développement
```bash
cd /home/star/Desktop/OPTINET
docker compose up --build
```

### Production
```bash
cd /home/star/Desktop/OPTINET
docker compose -f docker-compose.prod.yml up --build
```

### Erreur de démon Docker
Si vous voyez `Cannot connect to the Docker daemon`, lancez le démon Docker :

```bash
sudo systemctl start docker
```

Ou, si vous utilisez Podman, assurez-vous que le service utilisateur est actif :

```bash
systemctl --user start podman.socket
```

## Notes importantes

- Le backend Django écoute sur `0.0.0.0:8000`.
- Le frontend Vite écoute sur `0.0.0.0:5173` en mode développement.
- En production, le frontend est servi sur le port `80` via un serveur Node léger.
- Les requêtes `/api/` doivent pointer vers `backend:8000`.

## Rappels

- Assure-toi que Docker est installé et fonctionnel dans ton environnement.
- Si `docker compose` n’est pas disponible, utilise `docker-compose` selon la version de Docker.
