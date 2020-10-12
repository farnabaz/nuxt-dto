import type { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import ApiResponse from './ApiResponse'
import { ModelRequest } from './Mapper'
import { parseTemplate } from './utils'

export enum HttpMethods {
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
  GET = 'get',
  HEAD = 'head'
}

interface RequestMethod {
  <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
  <T>(clazz: new() => T, url: string, config?: AxiosRequestConfig): Promise<T>;
  <T>(clazz: [new() => T], url: string, config?: AxiosRequestConfig): Promise<T[]>;
  <T>(
    clazz: ((new() => T) | [(new() => T)]) | string,
    url?: string | AxiosRequestConfig,
    config?: AxiosRequestConfig
  ): Promise<T |T[] | ApiResponse>;
}

interface RequestMethodWithData {
  <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
  <T>(clazz: new() => T, url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  <T>(clazz: [new() => T], url: string, data?: any, config?: AxiosRequestConfig): Promise<T[]>;
  <T>(
    clazz: ((new() => T) | [(new() => T)]) | string,
    url?: string | AxiosRequestConfig | any,
    data?: any | AxiosRequestConfig,
    config?: AxiosRequestConfig
  ): Promise<T |T[] | ApiResponse>;
}
interface FetchOptions {
  params?: any;
  data?: any;
  config?: AxiosRequestConfig;
}

export default class HTTP {
  public get = this.createMethod(HttpMethods.GET);
  public head = this.createMethod(HttpMethods.HEAD);
  public delete = this.createMethod(HttpMethods.DELETE);

  public put = this.createMethodWithData(HttpMethods.PUT);
  public post = this.createMethodWithData(HttpMethods.POST);
  public patch = this.createMethodWithData(HttpMethods.PATCH);

  private ResponseHandler: new(context: any) => ApiResponse;
  private context: any;
  constructor (context: any, ResponseHandler?: new(axios: AxiosResponse) => ApiResponse) {
    this.context = context
    this.ResponseHandler = ResponseHandler || ApiResponse
  }

  public async fetch<T> (clazz: (new() => T), options: FetchOptions = {}): Promise<T> {
    const request = clazz.prototype.__request as ModelRequest
    const url = parseTemplate(request.path, options.params || {})
    switch (request.method) {
      case HttpMethods.HEAD: return this.head(clazz, url, options.data)
      case HttpMethods.DELETE: return this.delete(clazz, url, options.data)

      case HttpMethods.PUT: return this.put(clazz, url, options.data, options.config)
      case HttpMethods.POST: return this.post(clazz, url, options.data, options.config)
      case HttpMethods.PATCH: return this.patch(clazz, url, options.data, options.config)

      default: return this.get<T>(clazz, url, options.data)
    }
  }

  private createMethod (method: Method): RequestMethod {
    return async <T>(
      clazz: ((new() => T) | [new() => T]) | string,
      url?: string | AxiosRequestConfig,
      config?: AxiosRequestConfig
    ): Promise<T | T[] | ApiResponse> => {
      let [$clazz, $url, $config] = [clazz, url, config]
      if (typeof clazz === 'string') {
        [$clazz, $url, $config] = ['NO_CLASS', clazz as string, url as AxiosRequestConfig]
      }

      const axiosResponse = await this.context.$axios[method.toLowerCase()]($url as string, $config)
      const apiResponse = new this.ResponseHandler(axiosResponse)
      if ($clazz === 'NO_CLASS') {
        return apiResponse
      }

      if (Array.isArray($clazz)) {
        return apiResponse.model<T>($clazz as [new() => T])
      }

      return apiResponse.model<T>($clazz as new() => T)
    }
  }

  private createMethodWithData (method: Method): RequestMethodWithData {
    return async <T>(
      clazz: ((new() => T) | [(new() => T)]) | string,
      url?: string | AxiosRequestConfig,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T | T[] | ApiResponse> => {
      let [$clazz, $url, $data, $config] = [clazz, url, data, config]
      if (typeof clazz === 'string') {
        [$clazz, $url, $data, $config] = ['NO_CLASS', clazz as string, url as any, data as AxiosRequestConfig]
      }

      const axiosResponse = await this.context.$axios[method.toLowerCase()]($url as string, $data, $config)
      const apiResponse = new this.ResponseHandler(axiosResponse)
      if ($clazz === 'NO_CLASS') {
        return apiResponse
      }

      if (Array.isArray($clazz)) {
        return apiResponse.model<T>($clazz as [new() => T])
      }

      return apiResponse.model<T>($clazz as new() => T)
    }
  }

  public onRequest (fn: Function): void {
    this.context.$axios.interceptors.request.use((config: AxiosRequestConfig) => {
      return fn(config) || config
    }, undefined)
  }

  public onResponse (fn: Function): void {
    this.context.$axios.interceptors.response.use((response: AxiosResponse) => {
      return fn(response) || response
    }, undefined)
  }

  public onResponseError (fn: Function): void {
    this.context.$axios.interceptors.response.use(undefined, (error: AxiosError) => {
      return fn(error) || Promise.reject(error)
    })
  }

  public onRequestError (fn: Function): void {
    this.context.$axios.interceptors.request.use(undefined, (error: AxiosError) => {
      return fn(error) || Promise.reject(error)
    })
  }

  public onError (fn: Function): void {
    this.onResponseError(fn)
    this.onRequestError(fn)
  }
}
