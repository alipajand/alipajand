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
  }
});
