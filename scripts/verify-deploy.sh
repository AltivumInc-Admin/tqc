#!/usr/bin/env bash
# Post-deploy check: client-routed deep links must rewrite to the SPA shell.
# Usage: ./scripts/verify-deploy.sh https://main.dXXXXXXXXX.amplifyapp.com
set -euo pipefail

BASE="${1:?usage: verify-deploy.sh <base-url>}"
BASE="${BASE%/}"
case "$BASE" in
  https://*|http://localhost*) ;;
  *) echo "FAIL: base URL must be https:// (or http://localhost)"; exit 1 ;;
esac

code=$(curl -s -o /dev/null -w "%{http_code}" -- "$BASE/apply")
if [ "$code" != "200" ]; then
  echo "FAIL: $BASE/apply returned HTTP $code (expected 200 — check the SPA rewrite rule, infra/amplify-rewrites.json)"
  exit 1
fi

if ! curl -s -- "$BASE/apply" | grep -q '<div id="root">'; then
  echo "FAIL: $BASE/apply did not return the SPA shell"
  exit 1
fi

echo "OK: $BASE/apply rewrites to the SPA shell (HTTP 200)"
