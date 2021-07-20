<template>
  <div class="w-full d-flex justify-center mb-16">
    <v-btn
      :href="`/AliPajand_${isFa ? 'fa' : 'en'}.pdf`"
      class="animate zoom-in px-8 mx-1 text-transform-none"
      color="accent"
      depressed
      rounded
      target="_blank"
    >
      <strong>{{ $t('resume') }}</strong>
    </v-btn>

    <v-btn v-if="$i18n.locale === 'en'" :to="switchLocalePath('fa')" class="animate zoom-in mx-1" color="accent" icon>
      فا
    </v-btn>
    <v-btn v-else :to="switchLocalePath('en')" class="animate zoom-in mx-1" color="accent" icon>En</v-btn>

    <v-btn class="mx-1" color="accent" icon @click="changeTheme">
      <v-icon v-if="isDark" small>mdi-white-balance-sunny</v-icon>
      <v-icon v-else small>mdi-weather-night</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    changeTheme() {
      this.$store.commit('TOGGLE', 'isDark');
      this.$storage.setUniversal('theme', this.isDark ? 'dark' : 'light');
    }
  }
};
</script>

<style scoped></style>
