<template>
  <v-sheet max-width="700" class="ma-auto mh-screen d-flex flex-column justify-center align-center px-4 py-4">
    <Header />

    <Socials />

    <div class="w-full d-flex justify-center mb-16">
      <v-btn
        target="_blank"
        class="animate zoom-in px-8 mx-1 text-transform-none"
        color="accent"
        depressed
        rounded
        :href="`/resume_${isFa ? 'fa' : 'en'}.pdf`"
      >
        <strong>{{ $t('resume') }}</strong>
      </v-btn>

      <v-btn v-if="$i18n.locale === 'en'" class="animate zoom-in mx-1" color="accent" icon :to="switchLocalePath('fa')">
        فا
      </v-btn>
      <v-btn v-else color="accent" class="animate zoom-in mx-1" icon :to="switchLocalePath('en')">En</v-btn>

      <v-btn class="mx-1" icon color="accent" @click="changeTheme">
        <v-icon v-if="isDark" small>mdi-white-balance-sunny</v-icon>
        <v-icon v-else small>mdi-weather-night</v-icon>
      </v-btn>
    </div>

    <a target="_blank" href="https://fontiran.com/license/X6AWVH" class="position-fixed">
      <img src="https://fontiran.com/wp-content/uploads/2019/02/license1-1-360x360.png" width="30" height="30" />
    </a>
  </v-sheet>
</template>

<script>
import Header from '~/components/Header';
import Socials from '~/components/Socials';

export default {
  components: { Socials, Header },
  head() {
    return {
      title: this.$i18n.t('brandName') + ' - ' + this.$i18n.t('brandDesc')
    };
  },
  methods: {
    changeTheme() {
      this.$store.commit('TOGGLE', 'isDark');
      this.$storage.setUniversal('theme', this.isDark ? 'dark' : 'light');
    }
  }
};
</script>

<style lang="scss">
.dark-switch {
  position: absolute;
  top: 8px;
  left: 0;
  width: 100%;

  @media screen and (max-width: 960px) {
    width: auto;
    left: 5px;
    top: 5px;
  }
}

.position-fixed {
  position: fixed !important;
  left: 5px;
  bottom: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
</style>
