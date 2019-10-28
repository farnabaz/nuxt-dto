import { AxiosInstance } from "axios";
import path from "path";

import HTTP from "./HTTP";

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

export default function module(moduleOptions: any) {
    const options = {
        ...moduleOptions
    };

    // Register plugin
    this.addPlugin({
        src: path.resolve(__dirname, "plugin.js"),
        fileName: "http.js",
        options
    });
}

export { PropMap, PropsMap, Prop, Model, default as mapModel } from "./Mapper";
export { default as HTTP } from "./HTTP";
export { default as ApiResponse } from "./ApiResponse";
