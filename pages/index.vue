<template>
  <section class="h-screen overflow-x-hidden">
    <v-container class="py-0 position-relative">
      <div class="dark-switch d-flex align-center justify-center pa-2">
        <v-btn fab icon color="primary" @click="$store.commit('TOGGLE', 'isDark')">
          <v-icon v-if="isDark">mdi-white-balance-sunny</v-icon>
          <v-icon v-else>mdi-weather-night</v-icon>
        </v-btn>
      </div>
      <v-row justify="center" align="center" class="h-screen py-10" no-gutters>
        <v-col cols="12" md="7" xl="5">
          <div class="d-flex flex-column justify-center align-center">
            <Header />

            <Socials />

            <div class="w-full d-flex justify-center mt-4 mb-4">
              <v-btn
                target="_blank"
                class="animate zoom-in"
                color="accent"
                depressed
                :href="`/resume_${isFa ? 'fa' : 'en'}.pdf`"
              >
                <v-icon :class="[isFa ? 'ml-2' : 'mr-2']">mdi-cloud-download-outline</v-icon>
                <strong>{{ $t('resume') }}</strong>
              </v-btn>
            </div>

            <div class="mt-8 animate fade-in pb-10">
              <nuxt-link v-if="$i18n.locale === 'en'" :to="switchLocalePath('fa')">فارسی</nuxt-link>
              <nuxt-link v-else :to="switchLocalePath('en')">English</nuxt-link>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <a target="_blank" href="https://fontiran.com/license/X6AWVH" class="position-fixed">
      <img src="https://fontiran.com/wp-content/uploads/2019/02/license1-1-360x360.png" width="50" height="50" />
      <span style="text-align: justify">Registered</span>
    </a>
  </section>
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
