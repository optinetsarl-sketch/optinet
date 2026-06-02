# OPTINET

Ce dépôt regroupe deux applications :

- `backend/` : application Django
- `frontend/` : application React/Vite

## Dockerisation

Le projet est dockerisé en mode développement et production.

### Fichiers Docker

- `docker-compose.yml` : lancement développement backend + frontend
- `docker-compose.prod.yml` : lancement production avec backend Django et frontend Nginx
- `backend/Dockerfile` : image de développement Django
- `backend/Dockerfile.prod` : image de production Django avec Gunicorn
- `frontend/Dockerfile` : image de développement Vite
- `frontend/Dockerfile.prod` : image de production Vite + Nginx
- `frontend/nginx.conf` : configuration Nginx pour servir le frontend et proxy `/api/`
- `build-docker-images.sh` : script de construction des images Docker de production
- `DOCKER_SUMMARY.md` : résumé détaillé de la dockerisation

### Commandes utiles

#### Construire les images Docker de production
```bash
cd /home/star/Desktop/OPTINET
sh build-docker-images.sh
```

> Si vous obtenez une erreur du type `Cannot connect to the Docker daemon`, démarrez le démon Docker avec `sudo systemctl start docker`, ou utilisez Podman si installé.

#### Utiliser Docker Compose en développement
```bash
cd /home/star/Desktop/OPTINET
docker compose up --build
```

#### Utiliser Docker Compose en production
```bash
cd /home/star/Desktop/OPTINET
docker compose -f docker-compose.prod.yml up --build
```

### Notes

- Backend Django : `http://localhost:8000`
- Frontend dev Vite : `http://localhost:5173`
- Frontend production : `http://localhost`
- Le frontend redirige les requêtes `/api/` vers le backend via Nginx en production.

## Liens

- `DOCKER_SUMMARY.md` : détails supplémentaires et explications de la configuration Docker.
