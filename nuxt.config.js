require('dotenv').config()
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
    title: process.env.NUXT_ENV_APP_TITLE,
    titleTemplate: `%s - ${process.env.NUXT_ENV_APP_TITLE}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.NUXT_ENV_APP_DESCRIPTION },
      { hid: 'keywords', name: 'keywords', content: process.env.NUXT_ENV_APP_KEYWORDS },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
      // fonticon
      { src: '//at.alicdn.com/t/font_800619_qfgjd3y7yma.js' },
      // social share https://github.com/overtrue/share.js/
      { src: '/scripts/social-share.min.js' },
    ],
  },

  env: {
    debug: debug !== undefined ? debug : IS_DEV,
    baseURL,
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
    'github-markdown-css',
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
    { src: '@/plugins/version', ssr: false },
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
    loaders: {
      less: {
        javascriptEnabled: true,
      },
    },
    extractCSS: true,
    vendor: [
      'iview',
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
    },
  },
}
