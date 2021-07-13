<template>
  <v-app :dark="isDark" :style="{ fontFamily: isRTL ? 'iranyekan' : 'ubuntu' }">
    <v-main :class="{ 'grey darken-4 h-screen': isDark }">
      <v-fade-transition leave-absolute>
        <nuxt />
      </v-fade-transition>
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

      this.$store.commit('SET', { isRTL: lang === 'fa' });
      this.$vuetify.rtl = this.isRTL;
      this.$vuetify.lang.current = lang;

      this.$store.commit('SET', { isDark: theme === 'dark' });
      this.$vuetify.theme.dark = this.isDark;
    }
  }
};
</script>
