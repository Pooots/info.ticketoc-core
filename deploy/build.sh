#!/usr/bin/env bash
# Production build of this website, packaged for deploy/release.sh.
#
# The build runs in a clean temporary copy of the project, so local .env files, node_modules and dist
# never end up in a release, and a running dev server is left alone.
#
#   VITE_CMS_API_URL        required  origin of the CMS API, e.g. https://cms-api.example.com
#   VITE_CMS_SITE_KEY       optional  website shown on hostnames outside the tenant domain
#   VITE_CMS_TENANT_DOMAIN  optional  customer websites are served on subdomains of this domain
#                                     (must match CMS_HOSTING_<DESIGN>_URL in cms-web-ws)
#   SITE_NAME               optional  prefix of the release name (default: package.json name)
#   ALLOW_HTTP_API=1        optional  accept an http:// API URL (local tests only)
#
# These values are public identifiers that end up in the browser bundle; never put secrets here.
#
# Usage:  deploy/build.sh [--skip-tests]
# Output: deploy/out/<name>-<UTC time>[-<git sha>].tar.gz (the path is printed on the last line)
set -euo pipefail

fail() { echo "build: $*" >&2; exit 1; }

skip_tests=0
for arg in "$@"; do
  case "$arg" in
    --skip-tests) skip_tests=1 ;;
    -h | --help) awk 'NR > 1 { if (!/^#/) exit; print }' "$0"; exit 0 ;;
    *) fail "unknown option $arg" ;;
  esac
done

project=$(cd "$(dirname "$0")/.." && pwd)
api=${VITE_CMS_API_URL:-}
site_key=${VITE_CMS_SITE_KEY:-}
tenant=${VITE_CMS_TENANT_DOMAIN:-}

[[ -n $api ]] || fail "VITE_CMS_API_URL is required."
[[ $api =~ ^https?://[^/[:space:]]+$ ]] || fail "VITE_CMS_API_URL must be an origin such as https://cms-api.example.com (no path or trailing slash)."
[[ $api == https://* || ${ALLOW_HTTP_API:-0} == 1 ]] || fail "VITE_CMS_API_URL must use https (ALLOW_HTTP_API=1 allows http for local tests)."
[[ -n $site_key || -n $tenant ]] || fail "set VITE_CMS_SITE_KEY, VITE_CMS_TENANT_DOMAIN or both."
[[ -z $site_key || $site_key =~ ^[a-z0-9][a-z0-9-]*$ ]] || fail "VITE_CMS_SITE_KEY must be a website slug such as bhenti."
[[ -z $tenant || $tenant =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$ ]] ||
  fail "VITE_CMS_TENANT_DOMAIN must be a bare domain such as bhenti.sites.example.com (no scheme, port or wildcard)."

name=${SITE_NAME:-$(node -p "require(process.argv[1]).name" "$project/package.json")}
[[ $name =~ ^[A-Za-z0-9._-]+$ ]] || fail "SITE_NAME may only contain letters, digits, '.', '_' and '-'."
release="$name-$(date -u +%Y%m%dT%H%M%SZ)"
if sha=$(git -C "$project" rev-parse --short HEAD 2>/dev/null); then
  release="$release-$sha"
  [[ -z $(git -C "$project" status --porcelain 2>/dev/null) ]] || release="$release-dirty"
fi

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
rsync -a --exclude node_modules --exclude dist --exclude .git --exclude 'deploy/out' --exclude '.env*' "$project/" "$work/"
cd "$work"

echo "build: installing dependencies"
npm ci --no-audit --no-fund
if ((skip_tests == 0)); then
  echo "build: running tests"
  env -u VITE_CMS_API_URL -u VITE_CMS_SITE_KEY -u VITE_CMS_TENANT_DOMAIN npm test
fi

echo "build: building $release"
# exported even when empty: variables from the environment take precedence over any .env file
export VITE_CMS_API_URL="$api" VITE_CMS_SITE_KEY="$site_key" VITE_CMS_TENANT_DOMAIN="$tenant"
npm run build

[[ -f dist/index.html ]] || fail "the build produced no dist/index.html."
grep -rqF -- "$api" dist/assets || fail "the API URL is missing from the bundle."
[[ -z $tenant ]] || grep -rqF -- "$tenant" dist/assets || fail "the tenant domain is missing from the bundle."
if [[ $api != *localhost* ]] && grep -rqF "localhost:8000" dist/assets; then
  fail "the bundle still points at the development API (localhost:8000)."
fi

mkdir -p "$project/deploy/out"
archive="$project/deploy/out/$release.tar.gz"
COPYFILE_DISABLE=1 tar --no-xattrs -czf "$archive" -C dist .
echo "build: $release ($(du -h "$archive" | cut -f1 | tr -d ' '))"
echo "$archive"
