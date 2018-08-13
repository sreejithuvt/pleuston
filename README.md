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
  - [Ocean Protocol Components](#ocean-protocol-components)
     - [Keeper](#keeper)
     - [Provider](#provider)
     - [Database](#database)
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

## Ocean Protocol Components

All required components to get `pleuston` running are pre-configured and started with the above `docker-compose` command, and the web app is configured to connect to them.

If you want to change and run `pleuston` against your own deployed components, head over to the [`src/config.js`](./src/config.js) file and modify the respective values.

### Keeper

After following the instructions outlined above, Pleuston will connect to the locally running RPC client under `http://localhost:8545` where all required smart contracts are deployed so you don't have to configure anything else.

The Keeper Contracts ABI's are published as a [npm package](https://www.npmjs.com/package/@oceanprotocol/keeper-contracts) and imported in the project.

### Provider

The app connects to the locally running Ocean Protocol Provider backend, exposed under `http://localhost:5000`.

### Database

Pleuston is currently using [BigchainDB](http://github.com/bigchaindb/bigchaindb) as a database backend and is configured to automatically connect to the locally running BigchainDB node, exposed under `http://localhost:9984`.

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
