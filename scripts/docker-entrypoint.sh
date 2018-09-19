#!/bin/sh

envsubst < /pleuston/config/config.js.template > /pleuston/config/config.js
echo "Waiting for contracts to be generated..."
while [ ! -f "/pleuston/node_modules/@oceanprotocol/keeper-contracts/artifacts/ready" ]; do
  sleep 2
done
echo "Starting Pleuston..."
npm run build
serve -l tcp://"${LISTEN_ADDRESS}":"${LISTEN_PORT}" -s /pleuston/build/
