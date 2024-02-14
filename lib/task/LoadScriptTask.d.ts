import AbstractLoadTask from '../task/AbstractLoadTask';
/**
 * @description Load external script in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadScriptTask({
 *      assets: ['path/to/script.js'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
export default class LoadScriptTask extends AbstractLoadTask<HTMLScriptElement> {
    /**
     * @private
     * @method loadAsset
     * @param {string} src
     * @param {function} update
     * @returns {Promise<HTMLScriptElement>}
     */
    loadAsset(src: string, update?: (progress: number) => void): Promise<HTMLScriptElement>;
}
