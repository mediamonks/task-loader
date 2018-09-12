import Disposable from 'seng-disposable';
import sha1 from 'sha1';
import debug from 'debug';
import { ICacheObject } from './interface/ICacheObject';

export class CacheManager extends Disposable {
  /**
   * @description Object containing all the cached assets
   * @type {{}}
   * @private
   */
  private cache: ICacheObject = {};
  /**
   * @description Logger for displaying messages
   */
  private log: debug = debug('cacheManager');

  /**
   * @public
   * @method add
   * @param {string} id
   * @param asset
   * @param {string} nameSpace
   */
  public add(id: string, asset: any, nameSpace?: string): void {
    const hashedId = sha1(id);
    if (nameSpace) {
      this.getNameSpacedObject(nameSpace)[hashedId] = asset;
    } else {
      this.cache[hashedId] = asset;
    }
  }

  /**
   * @public
   * @method get
   * @param {string} id
   * @param {string} nameSpace
   * @returns {any}
   */
  public get(id: string, nameSpace?: string): any {
    const hashedId = sha1(id);
    if (nameSpace) {
      return this.getNameSpacedObject(nameSpace)[hashedId];
    }
    return this.cache[hashedId];
  }

  /**
   * @public
   * @method remove
   * @param {string} id
   */
  public remove(idOrNameSpace: string): void {
    const hashedId = sha1(idOrNameSpace);

    if (!this.cache[hashedId]) {
      this.log(`Unable to remove: ${idOrNameSpace}`);
    } else {
      delete this.cache[hashedId];
      this.log(`Removed ${idOrNameSpace} from cache`);
    }
  }

  /**
   * @private
   * @method getNamespace
   * @param {string} namespace
   * @returns {ICacheObject}
   */
  private getNameSpacedObject(nameSpace: string): ICacheObject {
    const hashedNameSpace = sha1(nameSpace);
    if (!this.cache[hashedNameSpace]) {
      this.cache[hashedNameSpace] = {};
    }

    return <ICacheObject>this.cache[hashedNameSpace];
  }

  /**
   * @public
   * @method dispose
   */
  public dispose(): void {
    this.cache = null;
    super.dispose();
  }
}

// Create an instance because there can only be one cache manager instance
const cacheManager = new CacheManager();

// Export the instances
export default cacheManager;
