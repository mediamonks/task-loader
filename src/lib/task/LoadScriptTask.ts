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
   * @returns {Promise<void>}
   */
  public loadAsset(src: string): Promise<HTMLScriptElement> {
    return new Promise(
      (resolve: (image: HTMLScriptElement) => void, reject: (reason: string) => void) => {
        const s = document.createElement('script');
        let r = false;
        s.type = 'text/javascript';
        s.src = src;
        const onload = () => {
          if (!r && (!s['readyState'] || s['readyState'] === 'complete')) {
            r = true;
            resolve(s);
          }
        };
        s.onload = onload;
        s.onerror = () => reject('Failed to load the script: ' + src);
        s['onreadystatechange'] = onload;
        const t = document.getElementsByTagName('script')[0];
        t.parentNode.insertBefore(s, t);
      },
    );
  }
}
