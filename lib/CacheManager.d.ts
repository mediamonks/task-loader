import Disposable from 'seng-disposable';
export declare class CacheManager extends Disposable {
    /**
     * @description Object containing all the cached assets
     * @type {{}}
     * @private
     */
    private cache;
    /**
     * @description Logger for displaying messages
     */
    private log;
    /**
     * @public
     * @method add
     * @param {string} id
     * @param asset
     * @param {string} nameSpace
     */
    add(id: string, asset: any, nameSpace?: string): void;
    /**
     * @public
     * @method get
     * @param {string} id
     * @param {string} nameSpace
     * @returns {any}
     */
    get(id: string, nameSpace?: string): any;
    /**
     * @public
     * @method remove
     * @param {string} id
     */
    remove(idOrNameSpace: string): void;
    /**
     * @private
     * @method getNamespace
     * @param {string} namespace
     * @returns {ICacheObject}
     */
    private getNameSpacedObject;
    /**
     * @public
     * @method dispose
     */
    dispose(): void;
}
declare const cacheManager: CacheManager;
export default cacheManager;
