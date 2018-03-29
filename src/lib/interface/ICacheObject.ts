/**
 * @description The cache object structure
 */

export interface ICacheObject {
  [id: string]: string | ICacheObject;
}
