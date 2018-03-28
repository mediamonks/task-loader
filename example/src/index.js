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
        label: 'LoadImageTask',
        progress: 0,
        options: {
          assets: ['./static/dummy-image.jpeg'],
        },
      },
      {
        constructor: LoadVideoTask,
        label: 'LoadVideoTask',
        progress: 0,
        options: {
          assets: ['./static/dummy-video.mp4'],
        },
      },
      {
        constructor: LoadJsonTask,
        label: 'LoadJsonTask',
        progress: 0,
        options: {
          assets: ['./static/dummy-json.json'],
        },
      },
      {
        constructor: LoadScriptTask,
        label: 'LoadScriptTask',
        progress: 0,
        options: {
          assets: ['./static/dummy-script.js'],
        },
      },
      {
        constructor: LoadHowlerAudioTask,
        label: 'LoadHowlerAudioTask',
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
    this.taskLoader.addEventListener(TaskLoaderEvent.START, event =>
      this.handleEvent('TaskLoader', event),
    );
    this.taskLoader.addEventListener(TaskLoaderEvent.UPDATE, event => {
      this.totalProgress = event.data.progress; // eslint-disable-line
      this.handleEvent('TaskLoader', event);
    });
    this.taskLoader.addEventListener(TaskLoaderEvent.COMPLETE, event =>
      this.handleEvent('TaskLoader', event),
    );
    this.taskLoader.addEventListener(TaskLoaderEvent.FAILED, event =>
      this.handleEvent('TaskLoader', event),
    );
  },
  methods: {
    handleStartClick() {
      this.started = true;
      const tasks = this.tasks.map(task => {
        const loadTask = new task.constructor(task.options);
        loadTask.addEventListener(TaskLoaderEvent.START, event =>
          this.handleEvent(task.label, event),
        );
        loadTask.addEventListener(TaskLoaderEvent.UPDATE, event => {
          task.progress = event.data.progress; // eslint-disable-line
          this.handleEvent(task.label, event);
        });
        loadTask.addEventListener(TaskLoaderEvent.COMPLETE, event =>
          this.handleEvent(task.label, event),
        );
        loadTask.addEventListener(TaskLoaderEvent.FAILED, event =>
          this.handleEvent(task.label, event),
        );

        return loadTask;
      });
      this.taskLoader.loadTasks(tasks);
    },
    handleEvent(label, event) {
      this.events.push(
        Object.assign(
          {
            eventType: `<strong>${label}</strong> ${event.type}`,
            data: event.data,
          },
          {},
        ),
      );
    },
  },
});
