import AbstractLoadTask from 'task-loader';

/**
 * @description Custom load task for the task loader
 *
 * Example:
 * ```typescript
 *  new Load{{name_pc}}Task({
 *      assets: ['path/to/asset.extension'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
export default class Load{{name_pc}}Task extends AbstractLoadTask<{{assetType}}> {
  /**
   * @private
   * @method loadAsset
   * @param {string} src
   * @returns {Promise<void>}
   */
  public loadAsset(src: string): Promise<{{assetType}}> {
    return new Promise((resolve: (asset: {{assetType}}) => void, reject: () => void) => {
      resolve();
    });
  }
}
