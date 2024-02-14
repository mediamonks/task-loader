"use strict";

exports.__esModule = true;
exports.default = sequentialPromises;

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
function sequentialPromises(promises, update) {
  // Counter to keep track of the promises that have been completed so we can dispatch the progress
  var count = 0; // If no promises are provided update with 100%

  if (promises.length === 0 && update !== undefined) {
    update(1);
  } // Return promises


  return promises.reduce(function (previousPromise, createNewPromise) {
    return previousPromise.then(function () {
      return update !== undefined ? update(count / promises.length - 1) : Promise.resolve();
    }).then(function () {
      return count += 1;
    }).then(function () {
      return createNewPromise();
    });
  }, Promise.resolve());
}