import Vue from 'vue/dist/vue.esm';

import LoadHowlerAudioTask from '../../src/lib/task/LoadHowlerAudioTask';
import LoadImageTask from '../../src/lib/task/LoadImageTask';
import LoadJsonTask from '../../src/lib/task/LoadJsonTask';
import LoadScriptTask from '../../src/lib/task/LoadScriptTask';
import LoadVideoTask from '../../src/lib/task/LoadVideoTask';
import TaskLoader from '../../src/lib/TaskLoader';
import TaskLoaderEvent from '../../src/lib/event/TaskLoaderEvent';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    started: false,
    events: [],
    totalProgress: 0,
    tasks: [
      {
        constructor: LoadImageTask,
        progress: 0,
        options: {
          assets: ['./static/dummy-image.jpeg'],
        },
      },
      {
        constructor: LoadVideoTask,
        progress: 0,
        options: {
          assets: ['./static/dummy-video.mp4'],
        },
      },
      {
        constructor: LoadJsonTask,
        progress: 0,
        options: {
          assets: ['./static/dummy-json.json'],
        },
      },
      {
        constructor: LoadScriptTask,
        progress: 0,
        options: {
          assets: ['./static/dummy-script.js'],
        },
      },
      {
        constructor: LoadHowlerAudioTask,
        progress: 0,
        options: {
          assets: ['./static/dummy-audio.{format}'],
          format: ['mp3'],
        },
      },
    ],
  },
  created() {
    this.taskLoader = new TaskLoader();
    this.taskLoader.addEventListener(TaskLoaderEvent.START, this.handleEvent);
    this.taskLoader.addEventListener(TaskLoaderEvent.UPDATE, this.handleUpdate);
    this.taskLoader.addEventListener(TaskLoaderEvent.COMPLETE, this.handleEvent);
    this.taskLoader.addEventListener(TaskLoaderEvent.FAILED, this.handleEvent);
  },
  methods: {
    handleStartClick() {
      this.started = true;
      const tasks = this.tasks.map(
        task =>
          new task.constructor(
            Object.assign(task.options, {
              onAssetLoaded: result => this.handleAssetLoaded(result, task),
            }),
          ),
      );
      this.taskLoader.loadTasks(tasks);
    },
    handleAssetLoaded({ index }, task) {
      // console.log('asset loaded', task.constructor.name);
      task.progress = (index + 1) / task.options.assets.length; // eslint-disable-line
    },
    handleEvent(event) {
      this.events.unshift(
        Object.assign(
          {
            eventType: event.type,
            data: event.data,
          },
          {},
        ),
      );
    },
    handleUpdate(event) {
      // console.log('handle update', event.data);
      this.totalProgress = event.data.progress;
      this.handleEvent(event);
    },
  },
});
