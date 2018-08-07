#!/usr/bin/env bash

set -e

cp -R ./node_modules/bigchaindb-driver/dist/node/ ./src/lib/bigchaindb-driver
cp -R ./node_modules/bigchaindb-orm/src/ ./src/lib/bigchaindb-orm
cp -R ./node_modules/decamelize/ ./src/lib/decamelize

replaceStrings () {
    # remove 'use strict'; from all js files
    sed -i "s|'use strict';||g" "$1"

    # replace require/import calls with local versions
    sed -i "s|'bigchaindb-driver'|'../bigchaindb-driver'|g" "$1"
    sed -i "s|'decamelize'|'../decamelize'|g" "$1"
}

for i in ./src/lib/**/*.js; do
    replaceStrings "$i"
done

for i in ./src/lib/**/**/*.js; do
    replaceStrings "$i"
done

printf '\n👍 Successfully copied BigchainDB drivers. Hooray!\n\n   See why we are doing this:\n   https://github.com/bigchaindb/js-driver-orm/issues/56\n'
