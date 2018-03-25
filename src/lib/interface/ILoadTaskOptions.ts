import IAssetLoadedResponse from "./IAssetLoadedResponse";

export default interface ILoadTaskOptions<T> {
  assets: Array<string> | string;
  batchSize?: number;
  cached?: boolean;
  cacheNameSpace?: string;
  onAssetLoaded?: (result: IAssetLoadedResponse<T>) => void;
}
