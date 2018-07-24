# plankton-frontend

![output](https://user-images.githubusercontent.com/6178597/41625184-37cf5e4c-7418-11e8-81c2-f779e5f7ee8b.gif)

[![Build Status](https://travis-ci.com/oceanprotocol/plankton-frontend.svg?token=3psqw6c8KMDqfdGQ2x6d&branch=master)](https://travis-ci.com/oceanprotocol/plankton-frontend)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)
[![css bigchaindb](https://img.shields.io/badge/css-bigchaindb-39BA91.svg)](https://github.com/bigchaindb/stylelint-config-bigchaindb)

## Development

The web app is a single page React app, created with [`create-react-app`](https://github.com/facebook/create-react-app).

To start development, clone this repo, install all dependencies, and start the development server:

```bash
git clone git@github.com:oceanprotocol/plankton-frontend.git
cd plankton-frontend/

npm i
npm start
```
This should output a message as follows:

```bash
Compiled successfully!

You can now view plankton-frontend in the browser.

  Local:            http://localhost:8000/
```

You can inspect a full production build by creating it first, and then run a local web server on top of the build output, e.g. [`serve`](https://github.com/zeit/serve).

> Oops - that didn't work - see [https://github.com/bigchaindb/js-driver-orm/issues/56](https://github.com/bigchaindb/js-driver-orm/issues/56)

```bash
# create production build
npm run build

serve -s build/
# go to http://localhost:5000
```

### Keeper

You need to have an Ethereum RPC client with all Keeper contracts deployed to it running on your machine. Head over to [keeper-contracts](https://github.com/oceanprotocol/keeper-contracts) and follow the instructions to get this up and running.

Keeper Contracts ABI's are published as a [NPM library](https://www.npmjs.com/package/@oceanprotocol/keeper-contracts) and imported in the project.

### DB

Plankton is currently using [BigchainDB](http://github.com/bigchaindb) as a database backend. It's easy to use the [testnet](https://testnet.bigchaindb.com/) or run locally with `docker-compose`.

### Conf

Check the configuration for the keeper and DB in `./src/config.js` and adjust to your likings.

### Code style

Code style follows [eslint-config-oceanprotocol](https://github.com/oceanprotocol/eslint-config-oceanprotocol) and [stylelint-config-bigchaindb](https://github.com/bigchaindb/stylelint-config-bigchaindb).
