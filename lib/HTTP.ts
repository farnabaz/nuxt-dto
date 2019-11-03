import { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import ApiResponse from "./ApiResponse";

enum HttpMethods {
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
  GET = "get",
  HEAD = "head"
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
    url?: string | AxiosRequestConfig,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T |T[] | ApiResponse>;
}

export default class HTTP {

  public get = this.createMethod(HttpMethods.GET);
  public head = this.createMethod(HttpMethods.HEAD);
  public delete = this.createMethod(HttpMethods.DELETE);

  public put = this.createMethodWithData(HttpMethods.PUT);
  public post = this.createMethodWithData(HttpMethods.POST);
  public patch = this.createMethodWithData(HttpMethods.PATCH);

  private responseHandler: new(context: any) => ApiResponse;
  private context: any;
  constructor(context: any, responseHandler?: new(axios: AxiosResponse) => ApiResponse) {
    this.context = context;
    this.responseHandler = responseHandler || ApiResponse;
  }

  private createMethod(method: Method): RequestMethod {
    return async <T>(
      clazz: ((new() => T) | [new() => T]) | string,
      url?: string | AxiosRequestConfig,
      config?: AxiosRequestConfig
    ): Promise<T | T[] | ApiResponse> => {
      let [$clazz, $url, $config] = [clazz, url, config];
      if (typeof clazz === "string") {
        [$clazz, $url, $config] = [undefined, clazz as string, url as AxiosRequestConfig];
      }

      const axiosResponse = await this.context.$axios[method.toLowerCase()]($url as string, $config);
      const apiResponse = new this.responseHandler(axiosResponse);
      if ($clazz === undefined) {
        return apiResponse;
      }

      if (Array.isArray($clazz)) {
        return apiResponse.model<T>($clazz as [new() => T]);
      }

      return apiResponse.model<T>($clazz as new() => T);
    };
  }

  private createMethodWithData(method: Method): RequestMethodWithData {
    return async <T>(
      clazz: ((new() => T) | [(new() => T)]) | string,
      url?: string | AxiosRequestConfig,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T | T[] | ApiResponse> => {
      let [$clazz, $url, $data, $config] = [clazz, url, data, config];
      if (typeof clazz === "string") {
        [$clazz, $url, $data, $config] = [undefined, clazz as string, url as any, data as AxiosRequestConfig];
      }

      const axiosResponse = await this.context.$axios[method.toLowerCase()]($url as string, $data, $config);
      const apiResponse = new this.responseHandler(axiosResponse);
      if ($clazz === undefined) {
        return apiResponse;
      }

      if (Array.isArray($clazz)) {
        return apiResponse.model<T>($clazz as [new() => T]);
      }

      return apiResponse.model<T>($clazz as new() => T);
    };
  }
}
