#!/bin/sh -e

cat > botinfo.js <<EOF
// token inserted via docker.startup.sh
exports.token = '${DISCORD_API_TOKEN}';
EOF

node index.js
