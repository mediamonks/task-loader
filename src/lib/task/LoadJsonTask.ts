import axios from 'axios';
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
      axios
        .get(src)
        .then(result => {
          if (update) update(1); // TODO: implement loading progress?
          resolve(result.data);
        })
        .catch(reason => reject(reason));
    });
  }
}
