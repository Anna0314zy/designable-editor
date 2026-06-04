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
load_env "$ROOT_DIR/tencent-image.digest.env"

export TENCENT_REGISTRY="${TENCENT_REGISTRY:-ccr.ccs.tencentyun.com}"
export TENCENT_IMAGE_NAMESPACE="${TENCENT_IMAGE_NAMESPACE:-zy11}"
export TENCENT_IMAGE_REPOSITORY="${TENCENT_IMAGE_REPOSITORY:-slide-screenshot}"
export TENCENT_IMAGE_TAG="${TENCENT_IMAGE_TAG:-latest}"
export TENCENT_SCF_IMAGE_URL="${TENCENT_SCF_IMAGE_URL:-${TENCENT_REGISTRY}/${TENCENT_IMAGE_NAMESPACE}/${TENCENT_IMAGE_REPOSITORY}:${TENCENT_IMAGE_TAG}}"

if [[ -z "${COS_SECRET_ID:-}" || -z "${COS_SECRET_KEY:-}" ]]; then
  echo "Missing COS_SECRET_ID or COS_SECRET_KEY." >&2
  echo "Fill them in tencent-image.env, or export them before running." >&2
  exit 1
fi

if ! command -v scf >/dev/null 2>&1; then
  echo "Missing scf command. Install it with: npm install -g serverless-cloud-framework" >&2
  exit 1
fi

echo "Deploying Tencent SCF image function..."
echo "Image: ${TENCENT_SCF_IMAGE_URL}"

cd "$ROOT_DIR/tencent-image"
scf deploy
