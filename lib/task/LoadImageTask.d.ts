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
    constructor(options: ILoadImageTaskOptions);
    /**
     * @private
     * @method loadAsset
     * @param {string} src
     * @param {function} update
     * @returns {Promise<HTMLImageElement>}
     */
    loadAsset(src: string, update?: (progress: number) => void): Promise<HTMLImageElement>;
}
/**
 * @description Howler has the option for multiple formats like mp3, ogg, mp4 etc
 */
export interface ILoadImageTaskOptions extends ILoadTaskOptions<HTMLImageElement> {
    crossOrigin?: string;
}
