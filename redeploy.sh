#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/Users/mcapace/WhiskyFestCigars}"
WEB_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$APP_DIR"
npx expo export --platform web --output-dir "$WEB_DIR" --clear

cd "$WEB_DIR"
node sanitize-build.cjs

git add -A
if git diff --cached --quiet; then
  echo "✅  No changes to commit"
else
  git commit -m "Update web export $(date '+%Y-%m-%d %H:%M:%S')"
fi

if command -v vercel >/dev/null 2>&1; then
  vercel deploy --prod --yes
fi
