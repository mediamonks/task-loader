import AbstractLoadTask from '../task/AbstractLoadTask';

/**
 * @description Load external json files in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadJsonTask({
 *      assets: ['path/to/file.json'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
export default class LoadJsonTask extends AbstractLoadTask<HTMLScriptElement> {
  /**
   * @private
   * @method loadAsset
   * @param {string} src
   * @param {function} update
   * @returns {Promise<any>}
   */
  public loadAsset(src: string, update?: (progress: number) => void): Promise<any> {
    return new Promise((resolve: (json: any) => void, reject: (reason: string) => void) => {
      fetch(src)
        .then(result => {
          if (!result.ok) {
            throw new Error();
          }

          if (update) update(1); // TODO: implement loading progress?

          return result.json();
        })
        .then(json => resolve(json))
        .catch(reason => reject(reason));
    });
  }
}
