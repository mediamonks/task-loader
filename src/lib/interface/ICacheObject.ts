/**
 * @description The cache object structure
 */
export default interface ICacheObject {
  [id: string]: string | ICacheObject;
};
