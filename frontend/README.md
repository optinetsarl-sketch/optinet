# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Dockerisation

Le frontend est dockerisé et peut être lancé avec le backend Django via Docker Compose.

### Commandes

- Développement :
  ```bash
  cd /home/star/Desktop/OPTINET
  docker compose up --build
  ```

- Production :
  ```bash
  cd /home/star/Desktop/OPTINET
  docker compose -f docker-compose.prod.yml up --build
  ```

### Ports

- Frontend dev : `http://localhost:5173`
- Backend Django : `http://localhost:8000`
- Frontend production : `http://localhost`

### Notes

- Le frontend de production est servi par un serveur Node léger.
- Les requêtes `/api/` doivent pointer vers le backend (`http://localhost:8000` ou l’URL de backend appropriée).
- Le backend collecte les fichiers statiques dans `STATIC_ROOT` avant de démarrer.
