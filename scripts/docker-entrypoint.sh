#!/bin/sh

envsubst < /pleuston/config/config.js.template > /pleuston/config/config.js
echo "Starting Pleuston..."
npm run build
serve -l tcp://"${LISTEN_ADDRESS}":"${LISTEN_PORT}" -s /pleuston/build/
