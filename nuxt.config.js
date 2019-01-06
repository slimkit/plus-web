require('dotenv').config()
const pkg = require('./package')
let debug = eval(process.env.DEBUG) // eslint-disable-line no-eval
const IS_DEV = process.env.NODE_ENV === 'development'
debug = debug !== undefined ? debug : IS_DEV
const baseURL = process.env.NUXT_ENV_API_HOST || 'http://localhost'

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
      // fonticon
      { src: '//at.alicdn.com/t/font_800619_fcyf4r10qv9.js' },
    ],
  },

  env: {
    debug: debug !== undefined ? debug : IS_DEV,
    apiURL: baseURL + '/api/v2',
  },

  /*
  ** Customize the progress-bar color
  */
  loading: '@/components/common/Progress.vue',

  /*
  ** Global CSS
  */
  css: [
  ],

  router: {
    base: process.env.NUXT_ENV_PATH_PREFIX || '/',
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/axios', ssr: true },
    { src: '@/plugins/iview', ssr: true },
    { src: '@/plugins/mixins', ssr: true },
    { src: '@/plugins/components', ssr: true },
    { src: '@/plugins/filters', ssr: true },
    { src: '@/plugins/directives', ssr: true },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // dotenv
    '@nuxtjs/dotenv',
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // inject style
    '@nuxtjs/style-resources',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: https?://[host]:[port][prefix]
    baseURL: `${baseURL}/api/v2`,
    proxy: true,
    prefix: '/api/v2',
  },

  proxy: {
    '/api': baseURL,
  },

  styleResources: {
    // inject the theme variables into every Vue components
    less: [
      '@/assets/less/theme.less',
      '@/assets/less/mixins.less',
    ],
  },

  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    vendor: [
      'lodash',
    ],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      // source map
      if (debug && ctx.isClient) {
        if (ctx.isDev) config.devtool = '#cheap-module-eval-source-map '
        else config.devtool = '#source-map'
      }

      // Run ESLint on save
      if (ctx.isDev && !ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }

      // less loader
      ctx.loaders.less.javascriptEnabled = true
    },
  },
}
