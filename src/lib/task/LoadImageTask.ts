import AbstractLoadTask from '../task/AbstractLoadTask';

/**
 * @description Load images in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadImageTask({
 *      assets: ['path/to/image.jpg'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
export default class LoadImageTask extends AbstractLoadTask<HTMLImageElement> {
  /**
   * @private
   * @method loadAsset
   * @param {string} src
   * @param {function} update
   * @returns {Promise<HTMLImageElement>}
   */
  public loadAsset(src: string, update?: (progress: number) => void): Promise<HTMLImageElement> {
    return new Promise((resolve: (image: HTMLImageElement) => void, reject: () => void) => {
      const image = new Image();
      image.onload = () => {
        if (update !== undefined) update(1); // TODO: implement loading progress?
        resolve(image);
      };
      image.crossOrigin = 'anonymous';
      image.onerror = reject;
      image.src = src;
    });
  }
}
