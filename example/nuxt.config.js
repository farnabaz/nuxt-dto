const { resolve } = require('path')

export default {
  rootDir: resolve(__dirname, '../'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  buildModules: [
    '@nuxt/typescript-build'
  ],
  build: {
    extend (config) {
      config.node = {
        fs: 'empty'
      }
    }
  },
  modules: [
    ['../dist/module', {
      handler: '~/utils/OurApiResponse'
    }],
    '@nuxtjs/axios'
  ]
}
