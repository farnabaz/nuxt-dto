import { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import ApiResponse from "./ApiResponse";

enum HttpMethods {
  POST = "post",
  PUT = "put",
  DELETE = "delete"
}

interface SendData {
  <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
  <T>(clazz: (new() => T) | [any], url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  <T>(
    clazz: ((new() => T) | [any]) | string,
    url?: string | AxiosRequestConfig,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T | ApiResponse>;
}

export default class HTTP {
    public put = this.setMethod(HttpMethods.PUT);
    public post = this.setMethod(HttpMethods.POST);
    public ["delete"] = this.setMethod(HttpMethods.DELETE);

    private responseHandler: new(context: any) => ApiResponse;
    private context: any;
    constructor(context: any, responseHandler?: new(axios: AxiosResponse) => ApiResponse) {
        this.context = context;
        this.responseHandler = responseHandler || ApiResponse;
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    public async get<T>(clazz: (new() => T) | [any], url: string, config?: AxiosRequestConfig): Promise<T>;

    public async get<T>(
      clazz: ((new() => T) | [any]) | string,
      url?: string | AxiosRequestConfig,
      config?: AxiosRequestConfig
    ): Promise<T | ApiResponse> {
      let [$clazz, $url, $config] = [clazz, url, config];
      if (typeof clazz === "string") {
        [$clazz, $url, $config] = [undefined, clazz as string, url as AxiosRequestConfig];
      }

      const axiosResponse = await this.context.$axios.get($url as string, $config);
      const apiResponse = new this.responseHandler(axiosResponse);
      if ($clazz === undefined) {
        return apiResponse;
      }

      return apiResponse.model<T>($clazz as new() => T);
    }

    private setMethod(method: Method): SendData {
      return async <T>(
        clazz: ((new() => T) | [any]) | string,
        url?: string | AxiosRequestConfig,
        data?: any,
        config?: AxiosRequestConfig
      ): Promise<T | ApiResponse> => {
        let [$clazz, $url, $data, $config] = [clazz, url, data, config];
        if (typeof clazz === "string") {
          [$clazz, $url, $data, $config] = [undefined, clazz as string, url as any, data as AxiosRequestConfig];
        }

        const axiosResponse = await this.context.$axios[method.toLowerCase()]($url as string, $data, $config);
        const apiResponse = new this.responseHandler(axiosResponse);
        if ($clazz === undefined) {
          return apiResponse;
        }

        return apiResponse.model<T>($clazz as new() => T);
      };
    }
}
