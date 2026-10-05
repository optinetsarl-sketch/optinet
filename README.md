# 🌐 OPTI-WEB — Site Web Officiel & Plateforme OPTINET SARL U

Plateforme web officielle d'**OPTINET SARL U** (Lomé, Togo) — Solutions informatiques, réseaux & télécoms, cybersécurité, développement web et vente d'équipements technologiques.

Ce sous-projet regroupe le **site web public** (vitrine, catalogue produits & boutique e-commerce, journal d'interventions), l'**espace d'administration** et l'**API REST Django**.

---

## 📑 Sommaire

1. [Architecture & Pile Technique](#-architecture--pile-technique)
2. [Fonctionnalités Principales](#-fonctionnalités-principales)
3. [Démarrage Rapide en Local](#-démarrage-rapide-en-local)
4. [Variables d'Environnement](#-variables-denvironnement)
5. [Endpoints API Principaux](#-endpoints-api-principaux)
6. [Déploiement Docker](#-déploiement-docker)
7. [Structure du Projet](#-structure-du-projet)

---

## 🏗 Architecture & Pile Technique

```
OPTI-WEB
├── 🖥️ frontend/  → React 19 + Vite 8 + React Router 7 + Chart.js
└── 🐍 backend/   → Django 5.2 + Django REST Framework + SimpleJWT
```

| Composant | Technologie | Détails |
|---|---|---|
| **Frontend** | React 19, Vite 8 | SPA fluide, multi-pages, multilingue (i18n), design responsive |
| **Backend API** | Python 3.11+, Django 5.2 | Django REST Framework, JWT SimpleJWT, gestion médias |
| **Base de Données** | SQLite (local) / PostgreSQL (prod) | Bascule automatique via `USE_SQLITE` dans `.env` |
| **Sécurité & Auth** | JWT Bearer Tokens | Rôles hiérarchiques : DG, SG, CD, CP, DV, UT |
| **Statistiques** | Moteur analytique intégré | Suivi anonyme (visiteurs uniques, pages vues, sources, appareils) |

---

## ✨ Fonctionnalités Principales

### 🌍 1. Site Public & Vitrine
- **Accueil dynamique** : Présentation des pôles d'activités, chiffres clés, réalisations récentes.
- **7 Domaines d'Expertise** :
  - Réseaux & Infrastructure
  - Sécurité & Vidéosurveillance
  - Fibre Optique & Télécoms
  - Serveurs & Virtualisation
  - Téléphonie d'Entreprise
  - Conseil & Formation
  - Développement & Applications Web
- **Pages institutionnelles** : À propos, Équipe de Direction, Certifications & Partenariats, Portfolio projets, Contact & Localisation.

### 🛒 2. Boutique « Nos Articles »
- Catalogue avec filtrage par catégorie et recherche textuelle.
- Fiches articles détaillées : galerie multi-photos zoomable, spécifications techniques complètes, disponibilité stock.
- Commande rapide intégrée (Panier, paiement à la livraison, redirection WhatsApp directe).

### 📰 3. Le Journal (Actualités & Interventions)
- Récits d'interventions terrain, réalisations techniques et annonces.
- Galerie photos intégrée, support des vidéos YouTube.
- Liens directs avec les services associés et passerelle avec **OPTIPUB**.

### 📊 4. Espace d'Administration & Métriques
- Tableau de bord avec statistiques en direct (visiteurs connectés, fréquentation 7j / 30j / 12m).
- Gestion des utilisateurs, attribution des rôles et statuts d'accès.
- Gestion du catalogue produits, du portfolio, des actualités et messagerie de contact.

---

## 🚀 Démarrage Rapide en Local

### 1. Prérequis
- **Python 3.11+**
- **Node.js 18+** & **npm**

---

### 2. Lancement du Backend (Django)

```powershell
# 1. Se positionner dans le dossier backend
cd "c:\MES APP-SOFT\OPTINET WEB-PUB\OPTI-WEB\backend"

# 2. Créer l'environnement virtuel (si pas encore créé)
py -3.11 -m venv venv_win

# 3. Activer l'environnement virtuel
.\venv_win\Scripts\activate

# 4. Installer les dépendances
pip install -r requirements.txt

# 5. Appliquer les migrations de base de données
python manage.py migrate

# 6. Démarrer le serveur API
# (Port 8001 recommandé en local si le port 8000 est utilisé)
python manage.py runserver 127.0.0.1:8001
```

> **API active sur :** `http://127.0.0.1:8001`  
> **Django Admin sur :** `http://127.0.0.1:8001/admin/`

---

### 3. Lancement du Frontend (React / Vite)

Dans un second terminal :

```powershell
# 1. Se positionner dans le dossier frontend
cd "c:\MES APP-SOFT\OPTINET WEB-PUB\OPTI-WEB\frontend"

# 2. Installer les dépendances (si nécessaire)
npm install

# 3. Lancer le serveur de développement Vite
npm run dev
```

> **Site accessible sur :** `http://localhost:5173/`

---

## ⚙️ Variables d'Environnement

### Backend (`backend/.env`)
```env
# Utiliser SQLite en local (True) ou PostgreSQL en production (False)
USE_SQLITE=True

# Paramètres PostgreSQL (utilisés uniquement si USE_SQLITE=False)
DB_NAME=optinet_db
DB_USER=kinera_user
DB_PASSWORD=kinera_password
DB_HOST=127.0.0.1
DB_PORT=5432
```

### Frontend (`frontend/.env`)
```env
# URL de l'API locale
VITE_API_URL=http://127.0.0.1:8001

# En production :
# VITE_API_URL=https://optinet.ginolux.com
```

---

## 🔌 Endpoints API Principaux

| Méthode | URL | Description | Accès |
|---|---|---|---|
| `POST` | `/api/login/` | Authentification JWT (obtention access & refresh token) | Public |
| `GET` | `/api/produits/` | Liste des produits (filtres: `?categorie=`, `?q=`) | Public |
| `GET` | `/api/produits/<uuid_ou_id>/` | Fiche produit détaillée | Public |
| `POST` | `/api/produits/create/` | Création produit avec photos | Admin (`Token`) |
| `GET` | `/api/categories-produits/` | Catégories d'articles | Public |
| `POST` | `/api/commandes/create/` | Enregistrement d'une commande client | Public |
| `GET` | `/api/actualites/` | Liste des articles du Journal (`?categorie=`, `?service=`) | Public |
| `POST` | `/api/actualites/create/` | Publication d'une actualité (ou via OPTIPUB) | Admin (`Token`) |
| `POST` | `/api/contact/create/` | Formulaire de contact public | Public |
| `POST` | `/api/track/` | Envoi d'un signal de visite anonyme | Public |
| `GET` | `/api/stats/visites/` | Statistiques analytiques (`?periode=7j\|30j\|12m`) | Admin (`Token`) |

---

## 🐳 Déploiement Docker

Le projet dispose d'une configuration multi-étapes pour déployer l'ensemble (Frontend build + Backend Django) dans un conteneur unifié.

```bash
# Construire l'image Docker
docker build -f Dockerfile -t optinet:latest .

# Lancer le conteneur avec volume pour les médias
docker run -d --name optinet-prod \
  -p 8000:8000 \
  -v /var/optinet/media:/app/media \
  --restart unless-stopped \
  optinet:latest
```

---

## 📂 Structure du Répertoire

```
OPTI-WEB/
├── backend/
│   ├── backend/            # Configuration Django (settings, urls, wsgi)
│   ├── OPTINET/            # Application principale (models, views, serializers)
│   ├── media/              # Fichiers médias (images produits, actualités)
│   ├── db.sqlite3          # Base de données locale SQLite
│   ├── manage.py           # CLI Django
│   ├── requirements.txt    # Dépendances Python
│   └── .env                # Configuration backend
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Composants réutilisables (Header, Sidebar, Cards)
│   │   ├── pages/index/    # 18 pages publiques du site
│   │   ├── pages/admin/    # 12 modules d'administration
│   │   ├── routes/         # Routage React Router
│   │   ├── services/       # Appels API Axios & gestion JWT
│   │   └── translations/   # Dictionnaires de traduction
│   ├── package.json        # Dépendances Node.js
│   ├── vite.config.js      # Configuration Vite
│   └── .env                # Configuration frontend
│
└── README.md               # Ce fichier de documentation
```

---

© **OPTINET SARL U** — Lomé, Togo. Tous droits réservés.
