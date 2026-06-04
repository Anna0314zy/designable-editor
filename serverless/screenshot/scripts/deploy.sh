#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE="$ROOT_DIR/s.fz.yaml"
RESOLVED_TEMPLATE="$(mktemp "$ROOT_DIR/.s.fz.resolved.XXXXXX.yaml")"

cleanup() {
  rm -f "$RESOLVED_TEMPLATE"
}
trap cleanup EXIT

export COS_SECRET_ID="${COS_SECRET_ID:-}"
export COS_SECRET_KEY="${COS_SECRET_KEY:-}"
export COS_BUCKET="${COS_BUCKET:-}"
export COS_REGION="${COS_REGION:-ap-beijing}"
export HOST="${HOST:-}"

node - "$TEMPLATE" "$RESOLVED_TEMPLATE" <<'NODE'
const fs = require("fs");
const [templatePath, outputPath] = process.argv.slice(2);

let yaml = fs.readFileSync(templatePath, "utf8");

function yamlScalar(value) {
  if (value === undefined || value === "") return '""';
  if (/^\d+(\.\d+)?$/.test(value)) return value;
  return JSON.stringify(value);
}

yaml = yaml.replace(
  /^(\s*[^#\n:][^#\n]*:\s*)\$\{env:([A-Z0-9_]+)\}\s*$/gm,
  (_, prefix, name) => `${prefix}${yamlScalar(process.env[name])}`
);
yaml = yaml.replace(/\$\{env:([A-Z0-9_]+)\}/g, (_, name) => process.env[name] || "");

fs.writeFileSync(outputPath, yaml);
NODE

s deploy -t "$RESOLVED_TEMPLATE" -y
