import AbstractLoadTask from './AbstractLoadTask';
import { Howl } from 'howler';
import ILoadTaskOptions from '../interface/ILoadTaskOptions';

/**
 * @description Load howler audio in the TaskLoader
 *
 * Example:
 * ```typescript
 *  new LoadHowlerAudioTask({
 *      assets: ['path/to/file.mp3'],
 *      onAssetLoaded: result => console.log(result),
 *  })
 * ```
 */
export default class LoadHowlerAudioTask extends AbstractLoadTask<Howl> {
  /**
   * @description Overwrite the default load options because howler requires extra data
   */
  protected options: ILoadHowlerAudioTaskOptions;

  /**
   * @private
   * @method loadAsset
   * @param {string} src
   * @param {function} update
   * @returns {Promise<Howl>}
   */
  public loadAsset(src: string, update?: (progress: number) => void): Promise<Howl> {
    return new Promise((resolve: (howl: Howl) => void) => {
      const sources = this.options.format.map(format => src.replace('format', format));
      const howl = new Howl({ src: sources });

      switch (howl.state()) {
        case state.UNLOADED:
        case state.LOADING:
          howl.once('load', () => {
            if (update) update(1); // TODO: implement loading progress?
            resolve(howl);
          });
        case state.LOADED: {
          if (update) update(1); // TODO: implement loading progress?
          resolve(howl);
        }
      }
    });
  }
}

/**
 * @description Howler has the option for multiple formats like mp3, ogg, mp4 etc
 */
export interface ILoadHowlerAudioTaskOptions extends ILoadTaskOptions<Howl> {
  format: Array<string>;
}

/**
 * @description The howler states
 * @type {{UNLOADED: string; LOADING: string; LOADED: string}}
 */
const state = {
  UNLOADED: 'unloaded',
  LOADING: 'loading',
  LOADED: 'loaded',
};
