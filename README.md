# task-loader

Add a description here...

[![Travis](https://img.shields.io/travis/mediamonks/task-loader.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/task-loader)
[![Code Climate](https://img.shields.io/codeclimate/github/mediamonks/task-loader.svg?maxAge=2592000)](https://codeclimate.com/github/mediamonks/task-loader)
[![Coveralls](https://img.shields.io/coveralls/mediamonks/task-loader.svg?maxAge=2592000)](https://coveralls.io/github/mediamonks/task-loader?branch=master)
[![npm](https://img.shields.io/npm/v/task-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/task-loader)
[![npm](https://img.shields.io/npm/dm/task-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/task-loader)

## Installation

```sh
yarn add task-loader
```

```sh
npm i -S task-loader
```


## Basic Usage

```ts
import TaskLoader from 'task-loader';
// import TaskLoader from 'task-loader/lib/classname';

// do something with TaskLoader
```


## Documentation

View the [generated documentation](http://mediamonks.github.io/task-loader/).


## Building

In order to build task-loader, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/mediamonks/task-loader.git
```

Change to the task-loader directory:
```sh
cd task-loader
```

Install dev dependencies:
```sh
yarn
```

Use one of the following main scripts:
```sh
yarn build            # build this project
yarn dev              # run compilers in watch mode, both for babel and typescript
yarn test             # run the unit tests incl coverage
yarn test:dev         # run the unit tests in watch mode
yarn lint             # run eslint and tslint on this project
yarn doc              # generate typedoc documentation
```

When installing this module, it adds a pre-commit hook, that runs lint and prettier commands
before committing, so you can be sure that everything checks out.


## Contribute

View [CONTRIBUTING.md](./CONTRIBUTING.md)


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © MediaMonks


