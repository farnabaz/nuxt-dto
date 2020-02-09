
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
    extend (config, { isDev, isClient }) {
  
       config.node = {
          fs: 'empty'
        }

    }
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    ['../dist/module', {
      handler: '~/utils/OurApiResponse'
    }]
  ]
}
