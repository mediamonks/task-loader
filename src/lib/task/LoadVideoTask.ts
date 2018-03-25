import AbstractLoadTask from '../task/AbstractLoadTask';

/**
 * @description Load videos in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadVideoTask({
 *      assets: ['path/to/video.mp4'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
export default class LoadVideoTask extends AbstractLoadTask<string> {
  /**
   * @private
   * @method loadImage
   * @param {string} src
   * @returns {Promise<void>}
   */
  public loadAsset(src: string, update?: (progress: number) => void): Promise<string> {
    return new Promise((resolve: (objectUrl: string) => void, reject: () => void) => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open('GET', src, true);
      xhr.responseType = 'blob';

      xhr.onprogress = (event: ProgressEvent) => {
        if (update) {
          update(event.loaded / event.total);
        }
      };

      xhr.onload = () => {
        xhr.onprogress = null;
        xhr.onload = null;
        xhr.onerror = null;

        if (xhr.status === 200) {
          resolve(URL.createObjectURL(xhr.response));
        } else {
          reject();
        }
      };

      xhr.onerror = () => {
        xhr.onprogress = null;
        xhr.onload = null;
        xhr.onerror = null;

        reject();
      };

      xhr.send();
    });
  }
}
