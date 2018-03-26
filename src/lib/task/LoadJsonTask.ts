import AbstractLoadTask from '../task/AbstractLoadTask';
import axios from 'axios';

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
   * @returns {Promise<any>}
   */
  public loadAsset(src: string): Promise<any> {
    return new Promise((resolve: (json: any) => void, reject: (reason: string) => void) => {
      axios
        .get(src)
        .then(result => resolve(result.data))
        .catch(reason => reject(reason));
    });
  }
}
