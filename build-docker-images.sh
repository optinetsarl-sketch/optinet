#!/usr/bin/env sh
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

find_builder() {
  if command -v docker >/dev/null 2>&1; then
    if docker info >/dev/null 2>&1; then
      echo docker
      return 0
    fi
  fi

  if command -v podman >/dev/null 2>&1; then
    echo podman
    return 0
  fi

  return 1
}

BUILDER=$(find_builder) || {
  echo "No working docker or podman installation found." >&2
  echo "If Docker is installed, start the daemon with 'sudo systemctl start docker'." >&2
  echo "If Podman is installed, start user socket with 'systemctl --user start podman.socket' or use 'podman system service'." >&2
  exit 1
}

echo "Using $BUILDER to build images."

echo "Building backend image..."
$BUILDER build -t optinet-backend:prod -f backend/Dockerfile.prod backend

echo "Building frontend image..."
$BUILDER build -t optinet-frontend:prod -f frontend/Dockerfile.prod frontend

echo ""
echo "Built images:"
echo "  optinet-backend:prod"
echo "  optinet-frontend:prod"

echo ""
echo "You can run them with $BUILDER run or via docker-compose.prod.yml."
