# task-loader

Class for loading assets

[![Travis](https://img.shields.io/travis/larsvanbraam/task-loader.svg?maxAge=2592000)](https://travis-ci.org/larsvanbraam/task-loader)
[![Code Climate](https://img.shields.io/codeclimate/github/larsvanbraam/task-loader.svg?maxAge=2592000)](https://codeclimate.com/github/larsvanbraam/task-loader)
[![Coveralls](https://img.shields.io/coveralls/larsvanbraam/task-loader.svg?maxAge=2592000)](https://coveralls.io/github/larsvanbraam/task-loader?branch=master)
[![npm](https://img.shields.io/npm/v/task-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/task-loader)
[![npm](https://img.shields.io/npm/dm/task-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/task-loader)

## Installation

```sh
yarn add task-loader
```

```sh
npm i -S task-loader
```

## Usage

### Task loader usage

```ts
import TaskLoader from 'task-loader';
import {
  LoadImageTask,
  LoadVideoTask,
  LoadHowlerAudioTask,
  LoadJsonTask,
  LoadScriptTask,
} from 'task-loader';

// Create the task loader instance
const taskLoader = new TaskLoader();

// Add events to the task
taskLoader.addEvents(TaskLoaderEvent.START, () => console.log('Start'));
taskLoader.addEvents(TaskLoaderEvent.UPDATE, ({ data }) => console.log('Update', data.progress));
taskLoader.addEvents(TaskLoaderEvent.COMPLETE, () => console.log('Complete'));
taskLoader.addEvents(TaskLoaderEvent.FAILURE, () => console.log('Failure during loading'));

// Load the tasks
taskLoader.loadTasks([
  new LoadImageTask({
    // Array of strings or a single string with the path to the asset
    assets: ['path/to/image-1.jpg', 'path/to/image-2.jpg'],
    // The size of a batch, this is how many requests happen at the same time
    batchSize: 1,
    // The weight of the load task, the higher the number the more weight a task has on the
    // total progress the lower the less. If none is provided all tasks have the same weight.
    weight: 2,
    // Flag to disable caching of assets, by default all
    // assets are stored in an object for faster retrieval.
    cached: true,
    // When loading a lot of assets (for example an image sequence)
    // you might want to group them so you can easily remove them when
    // you no longer need them
    cacheNameSpace: 'foo',
    // Triggered when an asset is loaded, returns the original index + the asset
    onAssetLoaded: ({index, asset}) => {}
  }),
  new LoadVideoTask({
    assets: ['path/to/video.mp4'],
  }),
  new LoadHowlerAudioTask({
    assets: ['path/to/audio.{format}}'],
    formats: ['mp3', 'ogg'],
  }),
  new LoadJsonTask({
    assets: ['path/to/file.json'],
  }),
  new LoadScriptTask({
    assets: ['path/to/file.js'],
  }),
])
.then(() => {
  console.log('All assets loaded')
});
.catch(() => {
  console.log('Failure during loading')
});

```

### Individual task usage
```ts
import { LoadVideoTask } from 'task-loader';

// Create the task
const task = new LoadVideoTask({
  assets: 'path/to/video-1.mp4',
});

// Add events to the task
task.addEvents(TaskLoaderEvent.START, () => console.log('Start'));
task.addEvents(TaskLoaderEvent.UPDATE, ({ data }) => console.log('Update', data.progress));
task.addEvents(TaskLoaderEvent.COMPLETE, () => console.log('Complete'));
task.addEvents(TaskLoaderEvent.FAILURE, () => console.log('Failure during loading'));

task.load()
.then(() => {
  // Dispose of the load task when it's done
  task.dispose();
  console.log('All assets loaded');
});
.catch(() => {
  console.log('Failure during loading');
});
```

### cacheManager usage

```ts
import cacheManager from 'task-loader';

// Manually add an asset to the cacheManager
const asset = document.createElement('img');
cacheManager.add('image', asset, 'bar');

// Retrieve an asset from the cache manager once it's loaded
const videoBlob = cacheManager.get('path/to/video.jp4'));

// Retrieve images stored in a namespace
const images = cacheManager.get('path/to/image-1.jpg', 'foo');

// Remove assets from cache
cacheManager.remove('path/to/video.mp4');

// Remove assets within a namespace
cacheManager.remove('foo');
```

## Example

I've included an example setup where you can see the loader in action, to run the project follow these steps:

- `git clone https://github.com/larsvanbraam/task-loader.git`
- `cd task-loader/example`
- `yarn`
- `yarn dev`
- Open your browser `localhost:8080`

or click [this link](https://larsvanbraam.github.io/task-loader/example) to preview online

## Documentation

View the [generated documentation](http://larsvanbraam.github.io/task-loader/docs).

## Building

In order to build task-loader, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:

```sh
git clone https://github.com/larsvanbraam/task-loader.git
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

[MIT](./LICENSE) © Lars van Braam
