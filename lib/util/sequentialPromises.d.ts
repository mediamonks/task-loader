/**
 * @public
 * @method sequentialPromises
 * @param promises
 * @param update
 * @returns {Promise}
 *
 * This method is like Promise.all() except this one wait for the previous promise to be completed before starting the
 * new promise. It also dispatches the progress back to the initial caller so you can see how far the chain is.
 *
 * ```typescript
 * sequentialPromises(
 *      [
 *          () => new Promise(resolve => setTimeout(resolve, 1000)),
 *          () => new Promise(resolve => setTimeout(resolve, 1000)),
 *      ],
 *      progress => console.log(`Progress update method: ${ progress }`)
 *  ).then(() => console.log('All promises are done);
 * ```
 */
export default function sequentialPromises(promises: Array<() => Promise<void>>, update?: (progress: number) => void): Promise<void>;
