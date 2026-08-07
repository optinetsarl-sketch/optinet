# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm config set fetch-timeout 120000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend (Django serves both)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy Python requirements and install
COPY backend/requirements.txt ./
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ .

# Copy frontend build to a location Django can serve
RUN mkdir -p /app/frontend_dist
COPY --from=frontend-builder /app/frontend/dist /app/frontend_dist

# Copy frontend assets to staticfiles so whitenoise can serve them
RUN mkdir -p /app/staticfiles/frontend
COPY --from=frontend-builder /app/frontend/dist /app/staticfiles/frontend

# Create a startup script
RUN printf '#!/bin/bash\nset -e\npython manage.py migrate --noinput\npython manage.py collectstatic --noinput\nexec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120\n' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 8000

CMD ["/app/start.sh"]
