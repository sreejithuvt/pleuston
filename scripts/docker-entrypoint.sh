#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
envsubst '${KEEPER_SCHEME} ${KEEPER_HOST} ${KEEPER_PORT} ${OCEAN_SCHEME} ${OCEAN_HOST} ${OCEAN_PORT}'\
  < ${DIR}/../src/config.js.template > $DIR/../src/config.js
sleep 30
npm run build
serve -l tcp://${LISTEN_ADDRESS}:${LISTEN_PORT} -s ${DIR}/../build/
