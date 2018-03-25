import Vue from 'vue/dist/vue.esm';

import LoadImageTask from '../../src/lib/task/LoadImageTask';
import LoadVideoTask from '../../src/lib/task/LoadVideoTask';
import TaskLoader from '../../src/lib/TaskLoader';
import TaskLoaderEvent from '../../src/lib/event/TaskLoaderEvent';

const app = new Vue({
  el: '#app',
  data: {
    totalProgress: 0,
    tasks: [
      {
        type: 'LoadImageTask',
        constructor: LoadImageTask,
        progress: 0,
        assets: [
          `https://picsum.photos/200/300/?random=1`,
          `https://picsum.photos/200/300/?random=2`,
          `https://picsum.photos/200/300/?random=3`,
          `https://picsum.photos/200/300/?random=4`,
          `https://picsum.photos/200/300/?random=5`,
          `https://picsum.photos/200/300/?random=6`,
        ],
      },
      {
        type: 'LoadImageTask',
        constructor: LoadImageTask,
        progress: 0,
        assets: [
          `https://picsum.photos/200/300/?random=7`,
          `https://picsum.photos/200/300/?random=8`,
          `https://picsum.photos/200/300/?random=9`,
          `https://picsum.photos/200/300/?random=10`,
          `https://picsum.photos/200/300/?random=11`,
          `https://picsum.photos/200/300/?random=12`,
        ],
      },
      {
        type: 'LoadVideoTask',
        constructor: LoadVideoTask,
        progress: 0,
        assets: [`./static/dummy-video.mp4`],
      },
    ],
  },
  created() {
    this.taskLoader = new TaskLoader();
    this.taskLoader.addEventListener(TaskLoaderEvent.START, this.handleStart);
    this.taskLoader.addEventListener(TaskLoaderEvent.UPDATE, this.handleUpdate);
    this.taskLoader.addEventListener(TaskLoaderEvent.COMPLETE, this.handleComplete);
  },
  mounted() {
    const loadTasks = this.tasks.map(
      task =>
        new task.constructor({
          assets: task.assets,
          onAssetLoaded: result => {
            task.progress = (result.index + 1) / task.assets.length; // eslint-disable-line
          },
        }),
    );
    this.taskLoader.loadTasks(loadTasks);
  },
  methods: {
    handleStart(event) {
      console.log('start', event);
    },
    handleUpdate(event) {
      this.totalProgress = event.data.progress;
    },
    handleComplete(event) {
      console.log('complete', event);
    },
  },
});
console.log(app);
