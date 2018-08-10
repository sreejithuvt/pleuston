[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

<h1 align="center">Pleuston</h1>

<p align="center">
  <img width="400" src="https://user-images.githubusercontent.com/90316/43195950-cc01fd90-9006-11e8-8d5e-cb802c6502b3.gif" />
</p>

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
  - [Provider](#provider)
     - [Run locally](#run-locally)
  - [Database](#database)
     - [Run locally](#run-locally)
  - [Code style](#code-style)
  - [Testing](#testing)
  - [License](#license)

---

## Features

This repository houses Pleuston, the reference web app for consumers to explore, download, and publish data assets.

- Publish data assets
- Download data assets
- ...

_architecture overview: pleuston, keeper, provider, database_

![output](https://user-images.githubusercontent.com/6178597/41625184-37cf5e4c-7418-11e8-81c2-f779e5f7ee8b.gif)

## Quick Start

Pleuston is a single page React app, bootstrapped with [`create-react-app`](https://github.com/facebook/create-react-app).

To start development, first clone this repository and start up all the other Ocean Protocol components with `docker-compose`:

```bash
git clone git@github.com:oceanprotocol/pleuston.git
cd pleuston/

docker-compose up
```

Then move on to a new terminal window, install all dependencies, and start the development server of `pleuston`:

```bash
npm i
npm start
````

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

After following the instructions outlined above, Pleuston will connect to the Ocean Protocol test network where all required smart contracts are deployed so you don't have to configure anything else.

The Keeper Contracts ABI's are published as a [npm package](https://www.npmjs.com/package/@oceanprotocol/keeper-contracts) and imported in the project.

### Run locally

If you want to run the app against a local Ethereum RPC client you need to make sure to deploy all required contracts to it first. Head over to [keeper-contracts](https://github.com/oceanprotocol/keeper-contracts) and follow the instructions to get this up and running.

After the RPC client is running on your machine, modify the respective config values in [`./src/config.js`](./src/config.js):

```js
module.exports = {
    ...
    keeperScheme: 'http',
    keeperHost: 'localhost',
    keeperPort: 8545,
    ...
}
```

## Provider

The app connects to the Ocean Protocol Provider backend...

### Run locally

_Instructions to run Provider locally_

After the Provider backend is running on your machine, modify the respective config values in [`./src/config.js`](./src/config.js):

```js
module.exports = {
    ...
    ocnScheme: 'http',
    ocnHost: 'localhost',
    ocnPort: 5000,
    ...
}
```

## Database

Pleuston is currently using [BigchainDB](http://github.com/bigchaindb/bigchaindb) as a database backend and is configured to automatically connect to an account on the [BigchainDB Test Network](https://testnet.bigchaindb.com/).

Optionally, you can create your own account under [testnet.bigchaindb.com](https://testnet.bigchaindb.com/) and use your own `app_id` & `app_key` in [`./src/config.js`](./src/config.js):

```js
module.exports = {
    ...
    dbHeaders: {
        app_id: 'dehwi323',
        app_key: 'hfjewib3h2i3h2jen2jk2nj3k2njk3'
    },
    ...
}
```

### Run locally

If you want to have the web app connect to a locally running instance of BigchainDB, you can do so with Docker:

```bash
cd db/bigchaindb/

# will use db/bigchaindb/Dockerfile-dev
docker-compose up
```

After BigchainDB is running on your machine, modify the respective config values in [`./src/config.js`](./src/config.js):

```js
module.exports = {
    ...
    dbScheme: 'http',
    dbHost: 'localhost',
    dbHeaders: {},
    dbPort: 9984,
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
