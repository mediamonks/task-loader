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
   * @type {number}
   * @description Number of task in the task loader, this is used for calculating the total progress
   */
  private taskCount: number = 0;
  /**
   * @private
   * @type {number}
   * @description The number of completed tasks in the task loader, this is used for calculating the total progress
   */
  private tasksCompleted: number = 0;
  /**
   * @private
   * @type {number}
   * @description The progress for the currently running task, this is used for calculating the total progress
   */
  private taskProgress: number = 0;

  /**
   * @description This method starts loading the tasks. You can provide an array of tasks which all contain their
   * own progress. When everything is done it will resolve the returned promise.
   * @param {Array<LoadTask≤any≥>} tasks
   * @returns {Promise<bool>}
   */
  public loadTasks(tasks: Array<AbstractLoadTask<any>>): Promise<boolean> {
    // Reset the data
    this.reset();

    this.taskCount = tasks.length;

    // Notify about the starting
    this.dispatchEvent(new TaskLoaderEvent(TaskLoaderEvent.START));

    return sequentialPromises(
      tasks.map(task => () =>
        task.load(progress => {
          // Update the task progress
          this.taskProgress = progress;
          // Notify about the progress
          this.update();
        }),
      ),
      progress => {
        // Reset the task progress
        this.taskProgress = 0;
        // Up the completed task counter
        this.tasksCompleted = this.taskCount * progress;
      },
    )
      .then(() => tasks.forEach(task => task.dispose()))
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
    return this.taskCount > 0 ? (this.tasksCompleted + this.taskProgress) / this.taskCount : 0;
  }

  /**
   * @private
   * @method reset
   * @description Reset the task loader to allow another batch of tasks to run through it.
   */
  private reset(): void {
    this.taskCount = 0;
    this.tasksCompleted = 0;
    this.taskProgress = 0;
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
    this.taskCount = null;
    this.tasksCompleted = null;
    this.taskProgress = null;
  }
}
