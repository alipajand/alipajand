import Vue from 'vue';

Vue.mixin({
  computed: {
    isFa() {
      return this.$i18n.locale === 'fa';
    },
    isDark() {
      return this.$store.getters.isDark;
    },
    isRTL() {
      return this.$store.getters.isRTL;
    }
  },
  watch: {
    '$i18n.locale'(newLocale) {
      this.$vuetify.lang.current = newLocale;
      this.$vuetify.rtl = newLocale === 'fa';
    }
  }
});
