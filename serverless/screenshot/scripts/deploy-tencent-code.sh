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

load_env "$ROOT_DIR/tencent-layer/.env"
load_env "$ROOT_DIR/tencent-code/.env"
load_env "$ROOT_DIR/deploy.tencent.env"

if ! command -v scf >/dev/null 2>&1; then
  echo "Missing scf command. Install it with: npm install -g serverless-cloud-framework" >&2
  exit 1
fi

export TENCENT_SCF_NODE_MODULES_LAYER_VERSION="${TENCENT_SCF_NODE_MODULES_LAYER_VERSION:-1}"

if [[ -z "${COS_SECRET_ID:-}" && -n "${TENCENT_SECRET_ID:-}" ]]; then
  export COS_SECRET_ID="$TENCENT_SECRET_ID"
fi

if [[ -z "${COS_SECRET_KEY:-}" && -n "${TENCENT_SECRET_KEY:-}" ]]; then
  export COS_SECRET_KEY="$TENCENT_SECRET_KEY"
fi

missing_vars=()
for var_name in TENCENT_SCF_NODE_MODULES_LAYER_VERSION COS_SECRET_ID COS_SECRET_KEY; do
  if [[ -z "${!var_name:-}" ]]; then
    missing_vars+=("$var_name")
  fi
done

if (( ${#missing_vars[@]} > 0 )); then
  echo "Missing required env vars: ${missing_vars[*]}" >&2
  echo "Create deploy.tencent.env from deploy.tencent.env.example, or export them before running." >&2
  exit 1
fi

echo "Deploying Tencent SCF code package..."
echo "Layer version: ${TENCENT_SCF_NODE_MODULES_LAYER_VERSION}"

cd "$ROOT_DIR/tencent-code"
scf deploy
