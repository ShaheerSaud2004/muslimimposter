#!/usr/bin/env bash
# Deploy Khafī Leaderboard API to DigitalOcean entirely from the CLI.
#
# Prereqs:
#   - doctl installed and authenticated (doctl auth init)
#   - psql (PostgreSQL client) installed
#   - This repo pushed to GitHub (branch: main)
#
# Usage:
#   cd leaderboard-api
#   GITHUB_REPO=yourusername/muslimimposter ./deploy-do.sh
#
# Optional:
#   DO_REGION=nyc1          (default)
#   DO_DB_SIZE=db-s-1vcpu-1gb

set -e

GITHUB_REPO="${GITHUB_REPO:-}"
DO_REGION="${DO_REGION:-nyc1}"
DO_DB_SIZE="${DO_DB_SIZE:-db-s-1vcpu-1gb}"
DB_CLUSTER_NAME="khafi-leaderboard-db"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPEC_FILE="${SCRIPT_DIR}/app-spec.yaml"

if [[ -z "$GITHUB_REPO" ]]; then
  echo "Error: Set GITHUB_REPO to your GitHub repo (e.g. yourusername/muslimimposter)"
  echo "  GITHUB_REPO=owner/repo $0"
  exit 1
fi

if ! command -v doctl &>/dev/null; then
  echo "Error: doctl not found. Install: https://docs.digitalocean.com/reference/doctl/how-to/install/"
  exit 1
fi

if ! doctl account get &>/dev/null; then
  echo "Error: doctl not authenticated. Run: doctl auth init"
  exit 1
fi

echo "=== 1. Create Managed Postgres database (if not present) ==="
if doctl databases list --format Name --no-header 2>/dev/null | grep -qx "$DB_CLUSTER_NAME"; then
  echo "Database cluster '$DB_CLUSTER_NAME' already exists."
  DB_ID=$(doctl databases list --format ID,Name --no-header | awk -v n="$DB_CLUSTER_NAME" '$2==n {print $1}')
else
  doctl databases create "$DB_CLUSTER_NAME" \
    --region "$DO_REGION" \
    --size "$DO_DB_SIZE" \
    --engine pg \
    --num-nodes 1 \
    --wait
  DB_ID=$(doctl databases list --format ID,Name --no-header | awk -v n="$DB_CLUSTER_NAME" '$2==n {print $1}')
fi

echo "Database ID: $DB_ID"

echo "=== 2. Run schema (requires psql) ==="
if ! command -v psql &>/dev/null; then
  echo "Warning: psql not found. Run the schema manually:"
  echo "  psql \"\$(doctl databases connection $DB_ID --format URI)\" -f $SCRIPT_DIR/schema.sql"
  read -r -p "Continue to app create without running schema? [y/N] " ok
  ok_lower=$(echo "$ok" | tr '[:upper:]' '[:lower:]')
  if [[ "$ok_lower" != "y" && "$ok_lower" != "yes" ]]; then
    exit 1
  fi
else
  URI=$(doctl databases connection "$DB_ID" --format URI --no-header)
  psql "$URI" -f "${SCRIPT_DIR}/schema.sql"
fi

echo "=== 3. Create App from spec (repo: $GITHUB_REPO) ==="
# Temp spec with repo substituted (avoid modifying committed file)
TMP_SPEC=$(mktemp)
sed "s|repo: GITHUB_REPO|repo: $GITHUB_REPO|" "$SPEC_FILE" > "$TMP_SPEC"

doctl apps create --spec "$TMP_SPEC"
rm -f "$TMP_SPEC"

echo "Done. Get your app URL with: doctl apps list"
echo "Then set EXPO_PUBLIC_LEADERBOARD_API_URL to that URL (e.g. https://khafi-leaderboard-api-xxxxx.ondigitalocean.app) in your app build."
