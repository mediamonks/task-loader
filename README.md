# task-loader

Class for loading assets

[![Travis](https://img.shields.io/travis/larsvanbraam/task-loader.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/task-loader)
[![Code Climate](https://img.shields.io/codeclimate/github/mediamonks/task-loader.svg?maxAge=2592000)](https://codeclimate.com/github/larsvanbraam/task-loader)
[![Coveralls](https://img.shields.io/coveralls/mediamonks/task-loader.svg?maxAge=2592000)](https://coveralls.io/github/larsvanbraam/task-loader?branch=master)
[![npm](https://img.shields.io/npm/v/@mediamonks/task-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/@mediamonks/task-loader)
[![npm](https://img.shields.io/npm/dm/task-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/@mediamonks/task-loader)

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
import TaskLoader, {
  LoadImageTask,
  LoadVideoTask,
  LoadJsonTask,
  LoadScriptTask,
} from 'task-loader';

// Create the task loader instance
const taskLoader = new TaskLoader();

// Add events to the task
taskLoader.addEventListener(TaskLoaderEvent.START, () => console.log('Start'));
taskLoader.addEventListener(TaskLoaderEvent.UPDATE, ({ data }) => console.log('Update', data.progress));
taskLoader.addEventListener(TaskLoaderEvent.COMPLETE, () => console.log('Complete'));
taskLoader.addEventListener(TaskLoaderEvent.FAILURE, () => console.log('Failure during loading'));

// Load the tasks
taskLoader.loadTasks([
  new LoadJsonTask({
    // Array of strings or a single string with the path to the asset
    assets: ['path/to/file.json'],
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
  new LoadImageTask({
    assets: ['path/to/image-1.jpg', 'path/to/image-2.jpg'],
    // Sometimes you might want change the image cross origin attribute, the default one is 'Use-Credentials'
    crossOrigin: 'anonymous',
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
task.addEventListener(TaskLoaderEvent.START, () => console.log('Start'));
task.addEventListener(TaskLoaderEvent.UPDATE, ({ data }) => console.log('Update', data.progress));
task.addEventListener(TaskLoaderEvent.COMPLETE, () => console.log('Complete'));
task.addEventListener(TaskLoaderEvent.FAILURE, () => console.log('Failure during loading'));

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

### Note
Keep in mind when tree shaking a module it will include all other dependencies for all tasks in your project (this means including Howler). If you do not want this, please include theme separately:

```typescript
import TaskLoader from 'task-loader/lib/TaskLoader';
import cacheManager from 'task-loader/lib/CacheManager';

import LoadImageTask from 'task-loader/lib/task/LoadImageTask';
import LoadVideoTask from 'task-loader/lib/task/LoadVideoTask';
import LoadJsonTask from 'task-loader/lib/task/LoadJsonTask';
import LoadScriptTask from 'task-loader/lib/task/LoadScriptTask';
```

## Example

I've included an example setup where you can see the loader in action, to run the project follow these steps:

- `git clone git@github.com:mediamonks/task-loader.git`
- `cd task-loader/example`
- `npm i`
- `npm run dev`
- Open your browser `localhost:8080`

or click [this link](https://mediamonks.github.io/task-loader/example) to preview online

## Documentation

View the [generated documentation](http://larsvanbraam.github.io/task-loader/docs).

## Building

In order to build task-loader, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:

```sh
git clone git@github.com:mediamonks/task-loader.git
```

Change to the task-loader directory:

```sh
cd task-loader
```

Install dev dependencies:

```sh
npm i
```

Use one of the following main scripts:

```sh
npm run build            # build this project
npm run dev              # run compilers in watch mode, both for babel and typescript
npm run test             # run the unit tests incl coverage
npm run test:dev         # run the unit tests in watch mode
npm run lint             # run eslint and tslint on this project
npm run doc              # generate typedoc documentation
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
