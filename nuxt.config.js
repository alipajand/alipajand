import fa from './lang/fa';
import en from './lang/en';

const projectName = 'Ali Pajand';
const themeColor = '#ff0000';
const isProduction = process.env.NODE_ENV === 'production';

const googleGTAG = 'G-BW797RRZJM';
const hostName = 'https://alipajand.com';
const webmasterTools = 'iyYj7AaQGewsnkLmxHIVsQD8nzFy8lj0r2ZajH5r0tY';

export default {
  ssr: false,

  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',

  server: {
    port: process.env.PORT || 4000,
    host: process.env.HOST || '0.0.0.0'
  },
  router: {
    middleware: 'scroll'
  },
  env: {
    isProduction,
    version: process.env.npm_package_version
  },

  // before loading all the contents
  loadingIndicator: {
    name: 'folding-cube',
    color: themeColor,
    background: 'white'
  },

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '',
    titleTemplate: (title) => title || 'Ali Pajand {Senior Frontend Developer}',
    meta: [
      { charset: 'utf-8' },
      { hid: 'keyword', property: 'keyword', content: '' },
      { hid: 'og:title', property: 'og:title', content: '' },
      { hid: 'og:keyword', property: 'og:keyword', content: '' },

      { hid: 'description', name: 'description', content: '' },
      { hid: 'og:description', content: '' },

      { httpEquiv: 'Expires', content: '0' },
      { httpEquiv: 'Pragma', content: 'no-cache' },
      { httpEquiv: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },

      { name: 'og:image:width', content: '512' },
      { name: 'og:image:height', content: '512' },
      { name: 'theme-color', content: themeColor },
      { name: 'application-name', content: projectName },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-touch-fullscreen', content: 'yes' },
      { name: 'twitter:image', content: '/images/icon.png' },
      { name: 'omsapplication-tap-highlight', content: 'no' },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: projectName },
      { name: 'google-site-verification', content: webmasterTools },
      { name: 'msapplication-navbutton-color', content: themeColor },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }, // or black-translucent to not join app with status bar
      { name: 'msapplication-TileImage', content: '/images/icons/mstile-144x144.png' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },

      { property: 'image', content: '/images/icon.png' },
      { property: 'og:image', content: '/images/icon.png' },
      { property: 'format-detection', content: 'telephone=no' },
      { property: 'format-detection', content: 'telephone=no' },
      { property: 'shortcut icon', content: '/images/icon.png', type: 'image/x-icon' },

      { property: 'og:type', content: 'website' },
      { property: 'og:name', content: projectName },
      { property: 'og:site_name', content: projectName }
    ],
    link: [
      { rel: 'mask-icon', href: '/images/icons/safari-pinned-tab.svg', color: themeColor },
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/images/icons/apple-touch-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/images/icons/apple-touch-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/images/icons/apple-touch-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/images/icons/apple-touch-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/images/icons/apple-touch-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/images/icons/apple-touch-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/images/icons/apple-touch-icon-180x180.png' },

      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/images/icons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/images/icons/favicon-16x16.png' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~/assets/scss/app.scss', '@mdi/font/css/materialdesignicons.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/mixins', '@/plugins/persistedstate.client'],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    '@nuxtjs/eslint-module',
    '@nuxtjs/universal-storage',
    '@nuxtjs/sitemap',
    '@nuxtjs/google-gtag', // google analytics
    'nuxt-i18n',
    'nuxt-compress',
    [
      '@nuxtjs/robots',
      {
        UserAgent: '*',
        Disallow: ''
      }
    ]
  ],

  i18n: {
    locales: [
      { code: 'fa', iso: 'fa-IR', dir: 'rtl', name: 'فارسی' },
      { code: 'en', iso: 'en-US', dir: 'ltr', name: 'English' }
    ],
    defaultLocale: 'fa',
    defaultDirection: 'auto',
    vueI18n: {
      fallbackLocale: 'fa',
      messages: { fa, en }
    },
    detectBrowserLanguage: {
      alwaysRedirect: false,
      fallbackLocale: '',
      onlyOnRoot: true,
      useCookie: true,
      cookieCrossOrigin: false,
      cookieDomain: null,
      cookieKey: 'i18n_redirected',
      cookieSecure: false
    },
    vuex: { moduleName: 'i18n', syncLocale: true, syncMessages: false, syncRouteParams: true }
  },

  // Toast module configuration
  toast: {
    duration: 5000,
    position: 'bottom-center',
    iconPack: 'custom-class'
  },

  // Nuxt Compress module configuration
  'nuxt-compress': isProduction
    ? {
        gzip: {
          cache: isProduction
        }
      }
    : {},

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: { proxyHeaders: false, credentials: false },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      status: 'ok',
      name: projectName, // in splash screen
      start_url: '/',
      orientation: 'portrait',
      short_name: projectName, // in home screen
      display: 'standalone', // suggest to user to add to home screen
      theme_color: themeColor, // status bar color
      background_color: themeColor, // background of splash screen
      gcm_user_visible_only: true,
      gcm_sender_id: '103953800507',
      prefer_related_applications: true
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    defaultAssets: false,
    customVariables: ['@/assets/scss/vuetify.scss'],
    optionsPath: './vuetify.options.js'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: isProduction,
    optimizeCSS: isProduction,

    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue|css)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        });
      }
    }
  },

  /**
   * sitemap generator
   */
  sitemap:
    isProduction && hostName
      ? {
          defaults: {
            changefreq: 'daily',
            priority: 1,
            lastmod: new Date()
          },
          hostname: hostName,
          gzip: isProduction
        }
      : {},

  'google-gtag':
    googleGTAG && isProduction
      ? {
          id: googleGTAG,
          config: {
            anonymize_ip: true, // anonymize IP
            send_page_view: true // might be necessary to avoid duplicated page track on page reload
          }
        }
      : {}
};
