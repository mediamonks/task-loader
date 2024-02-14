import EventDispatcher from 'seng-event';
import { ILoadTaskOptions } from '../interface/ILoadTaskOptions';
import { IBatch } from '../interface/IBatch';
export default abstract class LoadTask<T> extends EventDispatcher {
    /**
     * @description Array containing the batches of assets to be loaded
     * @type {Array}
     */
    protected batches: Array<Array<IBatch>>;
    /**
     * @description The default options for a task
     */
    protected options: ILoadTaskOptions<T>;
    constructor(options: ILoadTaskOptions<T>);
    /**
     * @public
     * @description Actually load the asset, this method should be overwritten in the parent class!
     * @method loadAsset
     * @param {string} src
     * @returns {Promise<T>}
     */
    abstract loadAsset(src: string, update?: (progress: number) => void): Promise<T>;
    /**
     * @public
     * @method setWeight
     * @param {number} weight
     */
    setWeight(weight: number): void;
    /**
     * @public
     * @method getWeight
     * @param {number} weight
     */
    getWeight(): number;
    /**
     * @public
     * @method load
     * @param {(progress: number) => void} update
     * @returns {Promise<void>}
     */
    load(update?: (progress: number) => void): Promise<void>;
    /**
     * @private
     * @method loadBatch
     * @description Load a batch of assets, we can do multiple xhr requests at the same time!
     * @param {Array<IBatch>} batch
     * @param {(progress: number) => void} update
     * @returns {Promise<void>}
     */
    private parseBatch;
    /**
     * @protected
     * @method createBatches
     * @description Split up the assets into smaller batches so we can do multiple xhr requests at the same time!
     */
    protected createBatches(): void;
    /**
     * @private
     * @method loadBatch
     * @param {IBatch} item
     * @param {Array<number>} batchProgress
     * @param {(progress: number) => void} update
     * @returns {Promise<any>}
     */
    private loadBatch;
    /**
     * @public
     * @method dispose
     */
    dispose(): void;
}
