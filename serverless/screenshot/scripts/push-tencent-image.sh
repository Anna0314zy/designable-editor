#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

load_env() {
  local env_file="$1"
  if [[ -f "$env_file" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
  fi
}

load_env "$ROOT_DIR/tencent-image.env"

export TENCENT_REGISTRY="${TENCENT_REGISTRY:-ccr.ccs.tencentyun.com}"
export TENCENT_REGISTRY_USERNAME="${TENCENT_REGISTRY_USERNAME:-100038466833}"
export TENCENT_IMAGE_NAMESPACE="${TENCENT_IMAGE_NAMESPACE:-zy11}"
export TENCENT_IMAGE_REPOSITORY="${TENCENT_IMAGE_REPOSITORY:-slide-screenshot}"
export TENCENT_IMAGE_TAG="${TENCENT_IMAGE_TAG:-latest}"
export TENCENT_NODE_IMAGE="${TENCENT_NODE_IMAGE:-mirror.ccs.tencentyun.com/library/node:16.13-alpine}"

if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Start Docker Desktop, then retry." >&2
  exit 1
fi

IMAGE_URL="${TENCENT_REGISTRY}/${TENCENT_IMAGE_NAMESPACE}/${TENCENT_IMAGE_REPOSITORY}:${TENCENT_IMAGE_TAG}"

echo "Logging in to ${TENCENT_REGISTRY} as ${TENCENT_REGISTRY_USERNAME}..."
docker login "${TENCENT_REGISTRY}" --username "${TENCENT_REGISTRY_USERNAME}"

echo "Building and pushing ${IMAGE_URL}..."
docker buildx build \
  --platform linux/amd64 \
  --build-arg NODE_IMAGE="${TENCENT_NODE_IMAGE}" \
  -t "${IMAGE_URL}" \
  "$ROOT_DIR/code" \
  --push

DIGEST="$(docker buildx imagetools inspect "${IMAGE_URL}" --format '{{json .Manifest.Digest}}' | tr -d '"')"
if [[ -n "${DIGEST}" && "${DIGEST}" != "null" ]]; then
  DIGEST_IMAGE_URL="${IMAGE_URL}@${DIGEST}"
  cat > "$ROOT_DIR/tencent-image.digest.env" <<EOF
TENCENT_SCF_IMAGE_URL=${DIGEST_IMAGE_URL}
EOF
else
  DIGEST_IMAGE_URL="${IMAGE_URL}"
  echo "Image pushed, but failed to resolve digest for ${IMAGE_URL}." >&2
fi

echo
echo "Pushed image:"
echo "${IMAGE_URL}"
echo "${DIGEST_IMAGE_URL}"
echo
echo "Use this before deploying the Tencent image function:"
echo "export TENCENT_SCF_IMAGE_URL=${DIGEST_IMAGE_URL}"
