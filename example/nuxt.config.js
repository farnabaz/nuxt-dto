
export default {
  mode: 'universal',
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxt/typescript-build'
  ],
  build: {
    extend (config) {
      config.node = {
        fs: 'empty'
      }
    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // This module must be imported before `@nuxtjs/axios`
    // since it depends on it to function correctly.
    ['../dist/module', {
      handler: '~/utils/OurApiResponse',
      debug: true
    }],
    '@nuxtjs/axios'
  ]
}
