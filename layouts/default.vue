<template>
  <v-app :dark="isDark">
    <v-main :class="{ 'grey darken-4 mh-screen': isDark }">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  watch: {
    isDark: {
      immediate: true,
      handler: 'updateModel'
    },
    '$i18n.locale'(newLocale) {
      this.$storage.setUniversal('lang', newLocale);
      this.updateModel();
    }
  },
  methods: {
    updateModel() {
      const lang = this.$storage.getUniversal('lang') || 'fa';
      const theme = this.$storage.getUniversal('theme') || 'light';

      const isRTL = lang === 'fa';
      const isDark = theme === 'dark';

      this.$vuetify.rtl = isRTL;
      this.$vuetify.lang.current = lang;
      this.$vuetify.theme.dark = isDark;

      this.$store.commit('SET', { isRTL, isDark });

      this.$storage.setUniversal('lang', lang);
      this.$storage.setUniversal('theme', theme);
    }
  }
};
</script>
