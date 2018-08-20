#!/usr/bin/env bash

set -e

# find ./src/lib | grep -v "README.md" | xargs rm -r && \

cp -R ./node_modules/bigchaindb-driver/dist/node/ ./src/lib/bigchaindb-driver
cp -R ./node_modules/bigchaindb-orm/src/ ./src/lib/bigchaindb-orm
cp -R ./node_modules/decamelize/ ./src/lib/decamelize

# more problematic deps
cp -R ./node_modules/eth-crypto/dist/es/ ./src/lib/eth-crypto
cp -R ./node_modules/eth-lib/ ./src/lib/eth-lib
cp -R ./node_modules/fetch-download/ ./src/lib/fetch-download

replaceStrings () {
    # remove 'use strict'; from all js files
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i "" "s|'use strict';||g" "$1"
        sed -i "" "s|\"use strict\"||g" "$1"

        sed -i "" "s| == | === |g" "$1"
        sed -i "" "s| != | !== |g" "$1"
    else
        sed -i "s|'use strict';||g" "$1"
        sed -i "s|\"use strict\"||g" "$1"

        sed -i "s| == | === |g" "$1"
        sed -i "s| != | !== |g" "$1"
    fi

    # replace require/import calls with local versions
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i "" "s|'bigchaindb-driver'|'../bigchaindb-driver'|g" "$1"
        sed -i "" "s|'decamelize'|'../decamelize'|g" "$1"
        sed -i "" "s|'eth-lib/lib/account'|'../eth-lib/lib/account'|g" "$1"
    else
        sed -i "s|'bigchaindb-driver'|'../bigchaindb-driver'|g" "$1"
        sed -i "s|'decamelize'|'../decamelize'|g" "$1"
    fi
}

for i in ./src/lib/**/*.js; do
    replaceStrings "$i"
done

for i in ./src/lib/**/**/*.js; do
    replaceStrings "$i"
done

# remove all test files
for i in ./src/lib/**/test*; do
    rm -rf "$i"
done

printf '👍 Successfully copied BigchainDB drivers. Hooray!\n\n   See why we are doing this:\n   https://github.com/bigchaindb/js-driver-orm/issues/56\n'
