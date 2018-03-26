/**
 * @description The cache object structure
 */

interface ICacheObject {
  [id: string]: string | ICacheObject;
}

export default ICacheObject;
