/* global hljs */
import Vue from 'vue/dist/vue.esm';

import LoadImageTask from '../../src/lib/task/LoadImageTask';
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
    activeTab: 0,
    totalProgress: 0,
    tasks: [
      {
        constructor: LoadImageTask,
        label: 'LoadImageTask',
        progress: 0,
        options: {
          assets: ['./static/dummy-image.jpeg'],
          weight: 2,
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
        constructor: LoadScriptTask,
        label: 'LoadScriptTask',
        progress: 0,
        options: {
          assets: ['./static/dummy-script.js'],
        },
      },
    ],
  },
  mounted() {
    // Highlight the code
    Array.from(document.body.querySelectorAll('pre')).forEach(element => {
      hljs.highlightBlock(element);
    });
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
    handleTabClick(index) {
      this.activeTab = index;
    },
  },
});
