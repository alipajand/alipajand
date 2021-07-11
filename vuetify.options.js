import fa from 'vuetify/es5/locale/fa';
import en from 'vuetify/es5/locale/en';

export default function ({ app }) {
  return {
    rtl: true,
    icons: false,
    lang: {
      locales: { fa, en },
      current: 'fa'
    },
    theme: {
      options: {
        customProperties: true,
        minifyTheme(css) {
          return process.env.NODE_ENV === 'production' ? css.replace(/[\r\n|\r|\n]/g, '') : css;
        }
      },
      themes: {
        light: {
          primary: '#0F75BC',
          secondary: '#F7941D',
          accent: '#e7382a',
          success: '#2bae52',
          warning: '#f08e20',
          error: '#fa6b6b'
        },
        dark: {
          primary: '#25AAE1',
          secondary: '#FCB040',
          accent: '#e7382a',
          success: '#2bae52',
          warning: '#f08e20',
          error: '#fa6b6b'
        }
      }
    }
  };
}
