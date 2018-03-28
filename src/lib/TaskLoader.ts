import EventDispatcher from 'seng-event/lib/EventDispatcher';
import AbstractLoadTask from './task/AbstractLoadTask';
import sequentialPromises from './util/sequentialPromises';
import TaskLoaderEvent from './event/TaskLoaderEvent';

/**
 * @class TaskLoader
 * @description The TaskLoader class is used to manage loading of tasks, it dispatches the task progress so it's
 * super simple to create pre-loaders which load all sorts of files.
 *
 * Example usage:
 * ```typescript
 *    const taskLoader = new TaskLoader();
 *    taskLoader.addEventListener(TaskLoaderEvent.START, event => console.log('start pre-loading)
 *    taskLoader.addEventListener(TaskLoaderEvent.UPDATE, event => console.log(`update, ${event.data.progress}`)
 *    taskLoader.addEventListener(TaskLoaderEvent.COMPLETE, event => console.log('done pre-loading)
 *
 *    taskLoader.loadTasks([
 *      new LoadVideoTask({
 *          assets: 'path/to/video.mp4',
 *          onAssetLoaded: result => console.log(result),
 *      }),
 *      new LoadImageTask({
 *          assets: [
 *              'path/to/image1.jpg',
 *              'path/to/image2.jpg',
 *              'path/to/image3.jpg',
 *              'path/to/image4.jpg',
 *              'path/to/image5.jpg',
 *              'path/to/image6.jpg',
 *          ],
 *          batchSize: 5,
 *          onAssetLoaded: result => console.log(result),
 *      }),
 *    ]).then(() => console.log('all assets have been loaded'));
 * ```
 */
export default class TaskLoader extends EventDispatcher {
  /**
   * @private
   * @description Array containing all the tasks that will be loaded
   * @type {any[]}
   */
  private tasks: Array<{
    progress: number;
    task: AbstractLoadTask<any>;
  }> = [];

  /**
   * @description This method starts loading the tasks. You can provide an array of tasks which all contain their
   * own progress. When everything is done it will resolve the returned promise.
   * @param {Array<LoadTask≤any≥>} tasks
   * @returns {Promise<bool>}
   */
  public loadTasks(tasks: Array<AbstractLoadTask<any>>): Promise<boolean> {
    // Reset the data
    this.reset();

    // Create the task objects
    this.tasks = tasks.reduce((tasks, task) => {
      tasks.push({
        task,
        progress: 0,
      });
      return tasks;
    }, []);

    // Apply the weight to all the tasks to make sure the total equals 1
    const weightPerTask = 1 / tasks.length;
    const weights = tasks.map(task => task.getWeight() * weightPerTask);
    // Extra weight value to be added to al tasks to match the total of 1
    const extraWeight =
      weights.reduce(
        (extraWeight, currentWeight) => extraWeight + (weightPerTask - currentWeight),
        0,
      ) / tasks.length;

    // Update the weight on each task
    tasks.forEach((task, index) => {
      task.setWeight(weights[index] + extraWeight);
    });

    // Notify about the starting
    this.dispatchEvent(new TaskLoaderEvent(TaskLoaderEvent.START));

    // Start loading the tasks
    return sequentialPromises(
      this.tasks.map(taskObject => () =>
        taskObject.task.load(progress => {
          // Update the task progress
          taskObject.progress = progress;
          // Notify about the progress
          this.update();
        }),
      ),
    )
      .then(() => this.tasks.forEach(taskObject => taskObject.task.dispose()))
      .then(() => this.dispatchEvent(new TaskLoaderEvent(TaskLoaderEvent.COMPLETE)))
      .catch(() => {
        this.dispatchEvent(new TaskLoaderEvent(TaskLoaderEvent.FAILED));
        throw new Error('Loading tasks failed');
      });
  }

  /**
   * @private
   * @method getProgress
   * @description get the total progress of the load action
   * @returns {number}
   */
  private getProgress(): number {
    // Calculate the total progress
    const totalProgress = this.tasks.reduce(
      (totalProgress, currentTask) =>
        totalProgress + currentTask.progress * currentTask.task.getWeight(),
      0,
    );

    // Divide by the amount of tasks
    return this.tasks.length ? totalProgress : 0;
  }

  /**
   * @private
   * @method reset
   * @description Reset the task loader to allow another batch of tasks to run through it.
   */
  private reset(): void {
    this.tasks = [];
  }

  /**
   * @private
   * @method update
   * @param {number} progress
   * @description Dispatches the current progress for the task loader
   */
  private update(): void {
    this.dispatchEvent(
      new TaskLoaderEvent(TaskLoaderEvent.UPDATE, {
        progress: this.getProgress(),
      }),
    );
  }

  /**
   * @public
   * @method dispose
   * @description Dispose the task loader and clean all the variables
   */
  public dispose(): void {
    this.tasks = null;
  }
}
