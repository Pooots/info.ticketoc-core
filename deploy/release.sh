#!/usr/bin/env bash
# Puts a build from deploy/build.sh live on a server, or rolls back to the previous release.
#
#   deploy/release.sh <archive.tar.gz> <target> <base dir>
#   deploy/release.sh --rollback <target> <base dir>
#
#   <target>    user@host (SSH), or "local" for this machine
#   <base dir>  e.g. /srv/sites/bhenti; the web server's document root is <base dir>/current
#
# Each release is unpacked into <base dir>/releases/<name> and "current" is a symlink replaced with a
# single rename, so visitors never see a half-copied site. <base dir>/.history lists what was live,
# oldest first; --rollback steps back one entry. The last KEEP_RELEASES live releases are kept.
#
#   SSH_KEY        private key file for SSH (default: your SSH configuration)
#   SSH_PORT       SSH port (default 22)
#   SSH_KNOWN_HOSTS  file with the server's host key; only that key is accepted (default: ~/.ssh/known_hosts)
#   KEEP_RELEASES  releases to keep, at least 2 (default 5)
#   SMOKE_URL      e.g. https://bhenti.com/ - after switching, this page and the script it loads must
#                  come from the new release; otherwise the previous release is restored and the
#                  script fails
set -euo pipefail

fail() { echo "release: $*" >&2; exit 1; }
usage() { awk 'NR > 1 { if (!/^#/) exit; print }' "$0"; exit 2; }

rollback=0
if [[ ${1:-} == --rollback ]]; then
  rollback=1
  shift
  (($# == 2)) || usage
  target=$1 base=$2
else
  (($# == 3)) || usage
  archive=$1 target=$2 base=$3
  [[ -f $archive ]] || fail "no such archive: $archive"
  name=$(basename "$archive" .tar.gz)
  [[ $name =~ ^[A-Za-z0-9._-]+$ && $archive == *.tar.gz ]] || fail "unexpected archive name: $archive"
  # not piped into grep -q: tar fails writing to a closed pipe, and pipefail would report a missing index.html
  listing=$(tar -tzf "$archive") || fail "cannot read $archive"
  grep -qxE '(\./)?index\.html' <<<"$listing" || fail "the archive has no index.html"
fi
[[ $base =~ ^/[A-Za-z0-9._/-]+$ && $base != */ ]] || fail "base dir must be an absolute path without spaces or a trailing slash"
[[ $target == local || $target =~ ^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+$ ]] || fail "target must be user@host or local"
keep=${KEEP_RELEASES:-5}
[[ $keep =~ ^[1-9][0-9]*$ ]] || fail "KEEP_RELEASES must be a number of at least 2"
((keep >= 2)) || fail "KEEP_RELEASES must be a number of at least 2"

ssh_args=(-o BatchMode=yes -p "${SSH_PORT:-22}")
[[ -z ${SSH_KEY:-} ]] || ssh_args+=(-i "$SSH_KEY" -o IdentitiesOnly=yes)
[[ -z ${SSH_KNOWN_HOSTS:-} ]] || ssh_args+=(-o "UserKnownHostsFile=$SSH_KNOWN_HOSTS" -o StrictHostKeyChecking=yes)

# Runs on the server: release <base> <name> <keep> | rollback <base> | has <base> <name> | live <base>
read -r -d '' remote <<'REMOTE' || true
set -euo pipefail
cmd=$1 base=$2
releases="$base/releases" history="$base/.history"
switch() {
  ln -sfn "releases/$1" "$base/.current.next"
  if mv --version >/dev/null 2>&1; then mv -Tf "$base/.current.next" "$base/current"; else mv -fh "$base/.current.next" "$base/current"; fi
}
live() { local t; t=$(readlink "$base/current" 2>/dev/null || true); echo "${t#releases/}"; }
set_history() { printf '%s\n' "$@" | sed '/^$/d' | tail -n 100 >"$history.next"; mv -f "$history.next" "$history"; }
case $cmd in
  release)
    name=$3 keep=$4 dir="$releases/$name"
    trap 'rm -rf -- "$dir.partial" "$releases/$name.tar.gz"' EXIT
    [[ ! -e $dir ]] || { echo "release $name already exists" >&2; exit 1; }
    rm -rf -- "$dir.partial"
    chmod u=rwx,go=rx "$releases"
    mkdir -p "$dir.partial"
    tar -xzf "$releases/$name.tar.gz" -C "$dir.partial"
    chmod -R u=rwX,go=rX "$dir.partial"
    mv "$dir.partial" "$dir"
    previous=$(live)
    switch "$name"
    set_history "$(cat "$history" 2>/dev/null)" "$name"
    echo "live: $name${previous:+ (previous: $previous)}"
    kept=$(tac "$history" 2>/dev/null || tail -r "$history")
    kept=$(awk '!seen[$0]++' <<<"$kept" | head -n "$keep")
    find "$releases" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | while read -r old; do
      grep -qxF -- "$old" <<<"$kept" || rm -rf -- "${releases:?}/$old"
    done
    ;;
  rollback)
    current=$(live)
    [[ -n $current ]] || { echo "nothing is live yet" >&2; exit 1; }
    entries=$(cat "$history" 2>/dev/null || true)
    [[ $(tail -n 1 <<<"$entries") == "$current" ]] || { echo "$history does not end with the live release $current; switch \"current\" by hand" >&2; exit 1; }
    entries=$(sed '$d' <<<"$entries")
    older=$(tail -n 1 <<<"$entries")
    [[ -n $older && -d $releases/$older ]] || { echo "no earlier release is kept for $current" >&2; exit 1; }
    switch "$older"
    set_history "$entries"
    echo "live: $older (rolled back from $current)"
    ;;
  has) [[ -e $releases/$3 ]] ;;
  live) live ;;
esac
REMOTE

run() {
  if [[ $target == local ]]; then bash -c "$remote" bash "$@"; else ssh "${ssh_args[@]}" "$target" bash -s -- "$@" <<<"$remote"; fi
}

if ((rollback)); then
  run rollback "$base"
  exit 0
fi

# the newest asset of the new build the page must load, e.g. /assets/index-3f9a1c.js
smoke() {
  local origin html script
  origin=$(sed -E 's#^(https?://[^/]+).*#\1#' <<<"$SMOKE_URL")
  html=$(curl -fsSL --max-time 20 -H 'Cache-Control: no-cache' "$SMOKE_URL") || { echo "release: $SMOKE_URL did not answer" >&2; return 1; }
  script=$(grep -oE '/assets/[^"]+\.js' <<<"$html" | head -n 1)
  [[ -n $script ]] || { echo "release: $SMOKE_URL has no /assets/ script" >&2; return 1; }
  grep -qxE "(\./)?${script#/}" <<<"$listing" || { echo "release: $SMOKE_URL still serves an older build ($script)" >&2; return 1; }
  curl -fsS --max-time 20 -o /dev/null "$origin$script" || { echo "release: $origin$script did not load" >&2; return 1; }
}

! run has "$base" "$name" || fail "release $name already exists in $base"
previous=$(run live "$base" 2>/dev/null || true)
if [[ $target == local ]]; then
  mkdir -p "$base/releases"
  cp "$archive" "$base/releases/$name.tar.gz"
else
  # shellcheck disable=SC2029 # base and name were validated above and are meant to expand here
  ssh "${ssh_args[@]}" "$target" "mkdir -p '$base/releases' && cat > '$base/releases/$name.tar.gz'" <"$archive"
fi
run release "$base" "$name" "$keep"

if [[ -n ${SMOKE_URL:-} ]]; then
  if smoke; then
    echo "release: smoke check passed ($SMOKE_URL)"
  else
    if [[ -n $previous ]]; then
      run rollback "$base" >&2 && echo "release: restored $previous" >&2
    else
      echo "release: there is no earlier release to restore; $name stays live" >&2
    fi
    exit 1
  fi
fi
