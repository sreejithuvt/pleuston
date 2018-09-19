#!/bin/sh

envsubst < /pleuston/config/config.js.template > /pleuston/config/config.js
echo "Waiting for keeper-contracts ${KEEPER_CONTRACTS_WAIT_SLEEP:-60} seconds..."
sleep ${KEEPER_CONTRACTS_WAIT_SLEEP:-60}
echo "Starting Pleuston..."
npm run build
serve -l tcp://"${LISTEN_ADDRESS}":"${LISTEN_PORT}" -s /pleuston/build/
