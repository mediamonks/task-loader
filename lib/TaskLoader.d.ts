import EventDispatcher from 'seng-event/lib/EventDispatcher';
import AbstractLoadTask from './task/AbstractLoadTask';
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
    private tasks;
    /**
     * @description This method starts loading the tasks. You can provide an array of tasks which all contain their
     * own progress. When everything is done it will resolve the returned promise.
     * @param {Array<LoadTask≤any≥>} tasks
     * @returns {Promise<bool>}
     */
    loadTasks(tasks: Array<AbstractLoadTask<any>>): Promise<boolean>;
    /**
     * @private
     * @method getProgress
     * @description get the total progress of the load action
     * @returns {number}
     */
    private getProgress;
    /**
     * @private
     * @method reset
     * @description Reset the task loader to allow another batch of tasks to run through it.
     */
    private reset;
    /**
     * @private
     * @method update
     * @param {number} progress
     * @description Dispatches the current progress for the task loader
     */
    private update;
    /**
     * @public
     * @method dispose
     * @description Dispose the task loader and clean all the variables
     */
    dispose(): void;
}
