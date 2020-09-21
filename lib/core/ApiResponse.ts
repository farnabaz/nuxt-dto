import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import mapModel from './Mapper'

export default class ApiResponse implements AxiosResponse {
  public data: any;
  public status: number;
  public statusText: string;
  public headers: any;
  public config: AxiosRequestConfig;
  public request?: any;

  constructor (response: AxiosResponse) {
    this.data = response.data
    this.status = response.status
    this.statusText = response.statusText
    this.headers = response.headers
    this.config = response.config
    this.request = response.request
  }

  public model<T>(modelClass: [new() => T]): T[];
  public model<T>(modelClass: new() => T): T;
  public model<T> (modelClass: (new() => T) | [new() => T]): T | T[] {
    return mapModel(modelClass, this.data)
  }

  public isSuccess (): boolean {
    return this.status === 200
  }
}
