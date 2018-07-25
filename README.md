[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Pleuston</h1>

> 🦑 🦄 Web app for consumers to explore, download, and publish data assets.

[![Build Status](https://travis-ci.com/oceanprotocol/pleuston.svg?token=3psqw6c8KMDqfdGQ2x6d&branch=master)](https://travis-ci.com/oceanprotocol/pleuston)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)
[![css bigchaindb](https://img.shields.io/badge/css-bigchaindb-39BA91.svg)](https://github.com/bigchaindb/stylelint-config-bigchaindb)

> _Pleuston [`ˈplustən`]: organisms that live in the thin surface layer existing at the air-water interface of a body of water as their habitat_

---

## Table of Contents

  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Keeper](#keeper)
     - [Run locally](#run-locally)
  - [Database](#database)
     - [Run locally](#run-locally)
  - [Code style](#code-style)
  - [Testing](#testing)
  - [License](#license)

---

## Features

This repository houses the web app for consumers to explore, download, and publish data assets.

- Publish data assets
- Download data assets
- ...

![output](https://user-images.githubusercontent.com/6178597/41625184-37cf5e4c-7418-11e8-81c2-f779e5f7ee8b.gif)

## Quick Start

The web app is a single page React app, created with [`create-react-app`](https://github.com/facebook/create-react-app).

To start development, clone this repository, install all dependencies, and start the development server:

```bash
git clone git@github.com:oceanprotocol/pleuston.git
cd pleuston/

npm i
npm start
```
This should output a message as follows:

```bash
Compiled successfully!

You can now view @oceanprotocol/pleuston in the browser.

  Local:            http://localhost:3000/
```

You can inspect a full production build by creating it first, and then run a local web server on top of the build output, e.g. [`serve`](https://github.com/zeit/serve).

```bash
# create production build
npm run build

serve -s build/
# go to http://localhost:5000
```

> Oops - that didn't work - see [https://github.com/bigchaindb/js-driver-orm/issues/56](https://github.com/bigchaindb/js-driver-orm/issues/56)

## Keeper

After following the instructions outlined above, the web app will connect to the Ocean Protocol test network where all smart contracts are deployed so you don't have to configure anything else.

The Keeper Contracts ABI's are published as a [NPM library](https://www.npmjs.com/package/@oceanprotocol/keeper-contracts) and imported in the project.

### Run locally

If you want to run the app against a local Ethereum RPC client you need to make sure to deploy all required contracts to it. Head over to [keeper-contracts](https://github.com/oceanprotocol/keeper-contracts) and follow the instructions to get this up and running.

After the RPC client is running on your machine, modify the respective config values in [`./src/config.js`](./src/config.js).

## Database

Plankton is currently using [BigchainDB](http://github.com/bigchaindb/bigchaindb) as a database backend. The web app is configured to automatically connect to the [BigchainDB Test Network](https://testnet.bigchaindb.com/).

### Run locally

If you want to have the web app connect to a locally running instance of BigchainDB, you can do so with Docker and the included Dockerfiles:

```bash
cd db/bigchaindb/

# will use db/bigchaindb/Dockerfile-dev
docker-compose up
```

After BigchainDB is running on your machine, modify the respective config values in [`./src/config.js`](./src/config.js):

```js
module.exports = {
    ...
    dbPort: '9984',
    dbScheme: 'http',
    dbHost: 'localhost'
    ...
}
```

## Code style

Code linting is setup with [ESLint](https://eslint.org) and [stylelint](https://stylelint.io) following [eslint-config-oceanprotocol](https://github.com/oceanprotocol/eslint-config-oceanprotocol) and [stylelint-config-bigchaindb](https://github.com/bigchaindb/stylelint-config-bigchaindb).

There's a npm script setup which runs all linting tests:

```bash
npm run lint
```

## Testing

Automatic tests are setup via Travis, executing `npm test`.

At the moment, besides linting tests, there's only one test checking if the whole app can be rendered.

## License

```
Copyright 2018 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
