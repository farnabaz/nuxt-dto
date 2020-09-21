import { ApiResponse, mapModel } from '../../lib/module'

export default class OurApiResponse extends ApiResponse {
  public model<T> (modelClass: (new() => T) | [new() => T]): T | T[] {
    return mapModel(modelClass, this.data)
  }
}
