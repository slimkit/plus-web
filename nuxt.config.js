require('dotenv').config()
const pkg = require('./package')
let debug = eval(process.env.DEBUG) // eslint-disable-line no-eval
debug = debug !== undefined ? debug : process.env.NODE_ENV === 'development'
const baseURL = process.env.NUXT_ENV_API_HOST || 'http://localhost:3000'

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
    debug: debug !== undefined ? debug : process.env.NODE_ENV === 'development',
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#59b6d7',
    failedColor: '#ed4014',
    throttle: 20,
    duration: 10,
  },

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
    { src: '@/plugins/iview', ssr: true },
    { src: '@/plugins/components', ssr: true },
    { src: '@/plugins/filters', ssr: true },
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
    // prefix: '/api/v2',
    debug: false,
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
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
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
