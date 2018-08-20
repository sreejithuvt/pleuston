#!/bin/sh

sleep 30

npm run build
serve -l tcp://0.0.0.0:3000 -s ./build/
