# OPTINET SARL U — Site web & plateforme de contenu

Site officiel d'**OPTINET SARL U** (Lomé, Togo) — solutions IT, télécom & web.
Le dépôt contient le **site public** (vitrine + boutique + journal) et son **API**.

- `backend/` : API **Django REST Framework** (+ Django Admin)
- `frontend/` : application **React / Vite** (servie par Django en production)

En ligne : **https://optinet-sarlu.ginolux.com** (aussi `optinet.ginolux.com`)

---

## Fonctionnalités

### Site vitrine
Accueil, **Services** (7 domaines : réseaux, sécurité, fibre, serveurs, téléphonie, conseil/formation, développement & applications), À propos, Direction, Certifications, Portfolio, Contact.

### Boutique — « Nos Articles »
- Un **produit = une fiche** avec **plusieurs photos** (modèles `Produit` / `PhotoProduit`).
- Liste + **barre de recherche** (nom / prix).
- Page détail `/articles/:id` : **galerie zoomable**, prix, **tableau de caractéristiques**, description, bouton **« Commander sur WhatsApp »**.

### Le Journal — actualités & interventions
- `Actualite` / `PhotoActualite` : titre, récit, **catégorie** (intervention terrain, réalisation, actualité, annonce), **vidéo YouTube** intégrée, galerie photos.
- Rubrique **`/journal`** (fil filtrable) + fiche **`/journal/:id`** (galerie, vidéo, partage).
- Chaque actualité peut être **liée à un service** → elle s'affiche sur la page de ce service.

### Publication depuis OPTIPUB
Les actualités du Journal sont créées d'un clic depuis **OPTIPUB Studio** (dépôt séparé), qui publie simultanément sur le site **et** les réseaux sociaux (Facebook, Instagram, LinkedIn) via l'API ci-dessous.

---

## Architecture & pile technique

| Couche | Techno |
|--------|--------|
| API | Django + Django REST Framework, JWT (SimpleJWT) |
| Base de données | **PostgreSQL** en production, SQLite en local (`USE_SQLITE=True`) |
| Frontend | React + Vite (build copié dans `frontend_dist`, servi par Django) |
| Médias | `ImageField` → dossier `media/` (volume Docker en prod) |
| Conteneur | Un seul conteneur : Django sert l'API **et** le frontend build |

### Principaux endpoints API

| Méthode | URL | Rôle |
|---------|-----|------|
| `GET` | `/api/produits/` · `/api/produits/<id>/` | Boutique (liste / détail) |
| `POST` | `/api/produits/create/` | Créer un produit (+ photos) — auth |
| `GET` | `/api/actualites/?categorie=&service=` | Journal (filtres) |
| `GET` | `/api/actualites/<id>/` | Détail actualité (photos + vidéo) |
| `POST` | `/api/actualites/create/` | Créer une actualité — auth |
| `POST` | `/api/login/` | Obtenir un jeton JWT |
| `GET/POST` | `/api/messages/`, `/api/portfolio/`, `/api/contacts/` | Contact / portfolio / carnet |

Gestion des contenus : **Django Admin** sur `/admin/` (produits & actualités avec photos en ligne).

---

## Développement local

### Backend
```bash
cd backend
python -m venv venv && source venv/Scripts/activate   # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
# .env : USE_SQLITE=True pour utiliser SQLite en local
python manage.py migrate
python manage.py runserver          # http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                         # http://localhost:5173
```
`frontend/.env` : `VITE_API_URL` = URL de l'API (ex. `http://127.0.0.1:8000` en local).

---

## Déploiement

Le site tourne dans **un conteneur Docker** construit par le `Dockerfile` (multi-étapes : build du frontend puis backend). L'image lance `migrate` puis le serveur au démarrage.

### Déploiement automatique (actif)
Un push sur `main` suffit : le serveur détecte le nouveau code (script `deploy.sh` lancé par cron) puis **reconstruit et redéploie tout seul**, avec rollback automatique en cas d'échec.

```bash
# construire l'image manuellement (si besoin)
docker build -f Dockerfile -t optinet:new .

# lancer le conteneur (réseau de la base + volume médias)
docker run -d --name optinet --network optinet -p 8000:8000 --restart unless-stopped \
  -v /chemin/vers/media:/app/media optinet:new
```

Voir aussi `docker-compose.prod.yml`, `Dockerfile`, `deploy.sh` et `DOCKER_SUMMARY.md`.

---

## Structure du dépôt

```
backend/            API Django + admin
  OPTINET/          modèles (Produit, PhotoProduit, Actualite, PhotoActualite, …),
                    serializers, views, urls, migrations
frontend/           React + Vite
  src/pages/index/  pages publiques (accueil, services, journal, boutique, …)
  src/components/    navbar, footer, …
Dockerfile          build multi-étapes (frontend + backend)
deploy.sh           déploiement automatique (surveille GitHub, rebuild, rollback)
```

---

© OPTINET SARL U — Lomé, Togo.
