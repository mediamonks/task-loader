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
  public loadAsset(src: string, update?: (progress: number) => void): Promise<HTMLScriptElement> {
    return new Promise(
      (resolve: (element: HTMLScriptElement) => void, reject: (reason: string) => void) => {
        const s = document.createElement('script');
        let r = false;
        s.type = 'text/javascript';
        s.src = src;
        const onload = () => {
          if (!r && (!s['readyState'] || s['readyState'] === 'complete')) {
            r = true;
            if (update) update(1); // TODO: implement loading progress?
            resolve(s);
          }
        };
        s.onload = onload;
        s.onerror = () => reject('Failed to load the script: ' + src);
        s['onreadystatechange'] = onload;
        const t = document.getElementsByTagName('head')[0];
        t.appendChild(s);
      },
    );
  }
}
