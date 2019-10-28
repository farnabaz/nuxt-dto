import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import ApiResponse from "./ApiResponse";

export default class HTTP {
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

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    public async post<T>(clazz: (new() => T) | [any], url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

    public async post<T>(
      clazz: ((new() => T) | [any]) | string,
      url?: string | AxiosRequestConfig,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T | ApiResponse> {
      let [$clazz, $url, $data, $config] = [clazz, url, data, config];
      if (typeof clazz === "string") {
        [$clazz, $url, $data, $config] = [undefined, clazz as string, url as any, data as AxiosRequestConfig];
      }

      const axiosResponse = await this.context.$axios.post($url as string, $data, $config);
      const apiResponse = new this.responseHandler(axiosResponse);
      if ($clazz === undefined) {
        return apiResponse;
      }

      return apiResponse.model<T>($clazz as new() => T);
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    public async put<T>(clazz: (new() => T) | [any], url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;

    public async put<T>(
      clazz: ((new() => T) | [any]) | string,
      url?: string | AxiosRequestConfig,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T | ApiResponse> {
      let [$clazz, $url, $data, $config] = [clazz, url, data, config];
      if (typeof clazz === "string") {
        [$clazz, $url, $data, $config] = [undefined, clazz as string, url as any, data as AxiosRequestConfig];
      }

      const axiosResponse = await this.context.$axios.put($url as string, $data, $config);
      const apiResponse = new this.responseHandler(axiosResponse);
      if ($clazz === undefined) {
        return apiResponse;
      }

      return apiResponse.model<T>($clazz as new() => T);
    }
}
