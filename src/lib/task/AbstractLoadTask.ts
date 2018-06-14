import EventDispatcher from 'seng-event';
import sequentialPromises from '../util/sequentialPromises';
import cacheManager from '../CacheManager';
import { ILoadTaskOptions } from '../interface/ILoadTaskOptions';
import { IBatch } from '../interface/IBatch';
import TaskLoaderEvent from '../event/TaskLoaderEvent';

export default abstract class LoadTask<T> extends EventDispatcher {
  /**
   * @description Array containing the batches of assets to be loaded
   * @type {Array}
   */
  protected batches: Array<Array<IBatch>> = [];

  /**
   * @description The default options for a task
   */
  protected options: ILoadTaskOptions<T> = {
    assets: [],
    batchSize: 1,
    weight: 1,
    cacheNameSpace: null,
    cached: true,
  };

  constructor(options: ILoadTaskOptions<T>) {
    super();

    // Assets must be an array, so if it's not provided we create it
    options.assets = !Array.isArray(options.assets) ? [options.assets] : options.assets;

    // Merge the options
    this.options = Object.assign(this.options, options);

    // Create the batches
    this.createBatches();
  }

  /**
   * @public
   * @description Actually load the asset, this method should be overwritten in the parent class!
   * @method loadAsset
   * @param {string} src
   * @returns {Promise<T>}
   */
  public abstract loadAsset(src: string, update?: (progress: number) => void): Promise<T>;

  /**
   * @public
   * @method setWeight
   * @param {number} weight
   */
  public setWeight(weight: number): void {
    this.options.weight = weight;
  }

  /**
   * @public
   * @method getWeight
   * @param {number} weight
   */
  public getWeight(): number {
    return this.options.weight;
  }

  /**
   * @public
   * @method load
   * @param {(progress: number) => void} update
   * @returns {Promise<void>}
   */
  public load(update?: (progress: number) => void): Promise<void> {
    const batchProgress = this.batches.map(() => 0);
    // Dispatch an event about the start
    this.dispatchEvent(new TaskLoaderEvent(TaskLoaderEvent.START));

    return sequentialPromises(
      this.batches.map((batch, batchIndex) => () => {
        return this.parseBatch(batch, progress => {
          batchProgress[batchIndex] = progress;
          // Calculate the total progress for the task
          const totalProgress =
            batchProgress.reduce(
              (totalProgress, currentProgress) => totalProgress + currentProgress,
              0,
            ) / batchProgress.length;

          // Dispatch an event with the task progress
          this.dispatchEvent(
            new TaskLoaderEvent(TaskLoaderEvent.UPDATE, {
              progress: totalProgress,
            }),
          );
          // Trigger the callback if provided
          if (update) {
            // Update with the batch progress total value
            update(totalProgress);
          }
        });
      }),
    )
      .then(() => {
        this.dispatchEvent(new TaskLoaderEvent(TaskLoaderEvent.COMPLETE));
      })
      .catch(reason => {
        this.dispatchEvent(new TaskLoaderEvent(TaskLoaderEvent.FAILED));
        throw new Error(`Task failed: ${reason}`);
      });
  }

  /**
   * @private
   * @method loadBatch
   * @description Load a batch of assets, we can do multiple xhr requests at the same time!
   * @param {Array<IBatch>} batch
   * @param {(progress: number) => void} update
   * @returns {Promise<void>}
   */
  private parseBatch(batch: Array<IBatch>, update?: (progress: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      const batchProgress = batch.map(() => 0);

      Promise.all(
        batch.map(item =>
          this.loadBatch(item, batchProgress, update).then(asset => {
            // Return the asset through the asset loaded callback method
            if (this.options.onAssetLoaded) {
              this.options.onAssetLoaded({
                asset,
                index: item.index,
              });
            }
          }),
        ),
      )
        .then(() => resolve())
        .catch(reason => reject(reason));
    });
  }

  /**
   * @protected
   * @method createBatches
   * @description Split up the assets into smaller batches so we can do multiple xhr requests at the same time!
   */
  protected createBatches(): void {
    (<Array<string>>this.options.assets).forEach((src, index) => {
      // Create new batch
      if (index % this.options.batchSize === 0) {
        this.batches.push(<any>[]);
      }
      // Push into the new batch
      this.batches[this.batches.length - 1].push({
        src,
        index,
        batchIndex: index % this.options.batchSize,
      });
    });
  }

  /**
   * @private
   * @method loadBatch
   * @param {IBatch} item
   * @param {Array<number>} batchProgress
   * @param {(progress: number) => void} update
   * @returns {Promise<any>}
   */
  private loadBatch(
    item: IBatch,
    batchProgress: Array<number>,
    update: (progress: number) => void,
  ): Promise<any> {
    const cachedItem = cacheManager.get(item.src, this.options.cacheNameSpace);

    if (cachedItem) {
      if (update) update(1);
      return Promise.resolve(cachedItem);
    }
    return this.loadAsset(item.src, progress => {
      batchProgress[item.batchIndex] = progress;

      if (update) {
        update(
          batchProgress.reduce(
            (totalProgress, currentProgress) => totalProgress + currentProgress,
            0,
          ) / batchProgress.length,
        );
      }
    }).then(asset => {
      // Add to the cache manager if enabled
      if (this.options.cached) {
        cacheManager.add(item.src, asset, this.options.cacheNameSpace);
      }
      return asset;
    });
  }

  /**
   * @public
   * @method dispose
   */
  public dispose(): void {
    this.options = null;
    this.batches = null;

    super.dispose();
  }
}
