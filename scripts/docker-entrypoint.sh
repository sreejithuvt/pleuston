#!/bin/sh

envsubst '${KEEPER_SCHEME} ${KEEPER_HOST} ${KEEPER_PORT} ${OCEAN_SCHEME} ${OCEAN_HOST} ${OCEAN_PORT}'\
  < /pleuston/config/config.js.template > /pleuston/config/config.js
sleep 30
npm run build
serve -l tcp://${LISTEN_ADDRESS}:${LISTEN_PORT} -s /pleuston/build/
