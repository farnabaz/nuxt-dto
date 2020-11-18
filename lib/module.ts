import { resolve, join } from 'path'
import { readdirSync } from 'fs'
import HTTP from './core/HTTP'
import type { Module } from '@nuxt/types'
import type { AxiosInstance } from 'axios'

declare module '@nuxt/types' {
    interface Context {
        $http: HTTP;
        $axios: AxiosInstance;
    }
}
declare module 'vue/types/vue' {
    interface Vue {
        readonly $http: HTTP;
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $http: HTTP;
    }
}

const nuxtDTOModule: Module = function module (moduleOptions: any) {
  const options = {
    ...moduleOptions
  }

  const directoriesToSyncInBuildDir = [
    'core',
    'plugins'
  ]

  const namespace = 'nuxt-dto'

  for (const dir of directoriesToSyncInBuildDir) {
    const path = resolve(__dirname, dir)
    for (const file of readdirSync(path)) {
      this.addTemplate({
        src: resolve(path, file),
        fileName: join(namespace, dir, file)
      })
    }
  }

  const plugins = [
    'plugins/http.js'
  ]

  if (options.debug) {
    plugins.unshift('plugins/logger.js')
  }

  for (const path of plugins) {
    this.addPlugin({
      src: resolve(__dirname, path),
      fileName: join(namespace, path),
      options
    })
  }
}

export { PropsMap, PropMap, Prop, Model, default as mapModel } from './core/Mapper'
export { default as HTTP } from './core/HTTP'
export { default as ApiResponse } from './core/ApiResponse'
export { default as logger } from './plugins/logger'
(nuxtDTOModule as any).meta = require('../package.json')
export default nuxtDTOModule
