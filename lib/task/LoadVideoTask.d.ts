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
     * @method loadAsset
     * @param {string} src
     * @returns {Promise<string>}
     */
    loadAsset(src: string, update?: (progress: number) => void): Promise<string>;
}
