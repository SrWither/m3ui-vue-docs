#!/usr/bin/env bash
set -euo pipefail

PKG="@m3ui-vue/m3ui-vue"
LOCAL_PATH="link:../m3ui-vue"
FILE="package.json"

cd "$(dirname "$0")"

usage() {
  echo "Usage: ./link.sh [local|npm|status]"
  echo "  local   — point dependency to local ../m3ui-vue"
  echo "  npm     — restore published version from npm"
  echo "  status  — show current mode"
}

get_mode() {
  local ver
  ver=$(node -p "require('./$FILE').dependencies['$PKG']")
  if [[ "$ver" == link:* || "$ver" == file:* ]]; then
    echo "local ($ver)"
  else
    echo "npm ($ver)"
  fi
}

set_local() {
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$FILE', 'utf8'));
    pkg.dependencies['$PKG'] = '$LOCAL_PATH';
    fs.writeFileSync('$FILE', JSON.stringify(pkg, null, 2) + '\n');
  "
  # clean pnpm.overrides if leftover from old approach
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$FILE', 'utf8'));
    if (pkg.pnpm) { delete pkg.pnpm; fs.writeFileSync('$FILE', JSON.stringify(pkg, null, 2) + '\n'); }
  "
  pnpm install
  echo "Switched to LOCAL (../m3ui-vue)"
}

set_npm() {
  local ver
  # get the latest published version
  ver=$(npm view "$PKG" version 2>/dev/null || echo "0.1.4")
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$FILE', 'utf8'));
    pkg.dependencies['$PKG'] = '^$ver';
    fs.writeFileSync('$FILE', JSON.stringify(pkg, null, 2) + '\n');
  "
  pnpm install
  echo "Switched to NPM (^$ver)"
}

case "${1:-status}" in
  local)  set_local ;;
  npm)    set_npm ;;
  status) echo "Current mode: $(get_mode)" ;;
  *)      usage ;;
esac
