import { Module } from '@nuxt/types'
import { resolve, join } from 'path'
import { readdirSync } from 'fs'
import { AxiosInstance } from "axios";

import HTTP from "./core/HTTP";

const libRoot = __dirname;

declare module "@nuxt/types" {
    interface Context {
        $http: HTTP;
        $axios: AxiosInstance;
    }
}
declare module "vue/types/vue" {
    interface Vue {
        readonly $http: HTTP;
    }
}

declare module "@nuxt/types" {
    interface NuxtAppOptions {
        $http: HTTP;
    }
}

const nuxtDTOModule: Module = function module(moduleOptions: any) {
    const options = {
        ...moduleOptions
    };

    const coreRoot = resolve(libRoot, 'core')

  for (const file of readdirSync(coreRoot)) {
    this.addTemplate({
        src: resolve(coreRoot, file),
        fileName: join('nuxt-dto', file)
    })
  }
    // Register plugin
    this.addPlugin({
        src: resolve(__dirname, "plugin.js"),
        fileName: "nuxt-dto/plugin.js",
        options
    });
}

export { PropsMap, PropMap, Prop, Model, default as mapModel } from "./core/Mapper";
export { default as HTTP } from "./core/HTTP";
export { default as ApiResponse } from "./core/ApiResponse";
export default nuxtDTOModule;
