import AbstractLoadTask from '../task/AbstractLoadTask';
import { ILoadTaskOptions } from '../interface/ILoadTaskOptions';

/**
 * @description Load images in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadImageTask({
 *      assets: ['path/to/image.jpg'],
 *      onAssetLoaded: result => console.log(result),
 *      crossOrigin: 'Use-Credentials',
 *  })
 * ```
 */
export default class LoadImageTask extends AbstractLoadTask<HTMLImageElement> {
  /**
   * @description Overwrite the default load options because we have extra configuration
   */
  protected options: ILoadImageTaskOptions = {
    crossOrigin: 'Use-Credentials',
    assets: [],
    batchSize: 1,
    weight: 1,
    cacheNameSpace: null,
    cached: true,
  };

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
      image.crossOrigin = this.options.crossOrigin;
      image.onerror = reject;
      image.src = src;
    });
  }
}

/**
 * @description Howler has the option for multiple formats like mp3, ogg, mp4 etc
 */
export interface ILoadImageTaskOptions extends ILoadTaskOptions<HTMLImageElement> {
  crossOrigin: string;
}
