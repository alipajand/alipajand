<template>
  <v-sheet
    class="bg-transparent ma-auto mh-screen d-flex flex-column justify-center align-center px-4 py-4"
    max-width="700"
  >
    <Header />

    <Socials />
    <Settings />

    <a class="position-fixed" href="https://fontiran.com/license/X6AWVH" target="_blank">
      <img height="30" src="https://fontiran.com/wp-content/uploads/2019/02/license1-1-360x360.png" width="30" />
    </a>
  </v-sheet>
</template>

<script>
import Header from '~/components/shared/Header';
import Socials from '~/components/shared/Socials';
import Settings from '~/components/shared/Settings';

export default {
  components: { Socials, Header, Settings },
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
