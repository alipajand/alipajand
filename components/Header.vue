<template>
  <div :class="['header d-flex flex-column justify-center align-center w-full mb-6', { extend: showSkill }]">
    <img alt="ali pajand" class="animate zoom rounded-xl" height="170" src="/images/avatar.jpg" />
    <h1 class="mt-4 animate slide-down delay-1">{{ $t('brandName') }}</h1>
    <h4 :class="['grey--text mt-5 animate slide-up text-center', isDark ? 'text--lighten-5' : 'text--darken-2']">
      {{ $t('brandDesc') }}
    </h4>
    <div class="d-flex align-center flex-column flex-lg-row justify-center mt-1 w-full mb-6">
      <h5
        :class="[
          'grey--text text-body-1 animate slide-up d-flex flex-wrap justify-center align-center',
          isDark ? 'text--lighten-3' : 'text--darken-1'
        ]"
      >
        <span v-for="(fluent, i) in fluents" :key="i" class="px-1">{{ fluent }}</span>
      </h5>
      <v-btn
        :class="['animate flip-in-x mt-3 mt-md-0', isFa ? 'mr-2' : 'ml-2']"
        small
        text
        @click="showSkill = !showSkill"
      >
        <span>{{ showSkill ? $t('hide') : $t('show') }} {{ $t('other') }} {{ $t('skills') }}</span>
        <v-icon v-if="showSkill">mdi-chevron-down</v-icon>
        <v-icon v-else-if="isFa" small>mdi-chevron-left</v-icon>
        <v-icon v-else small>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <v-expand-transition>
      <Skills v-if="showSkill" />
    </v-expand-transition>
  </div>
</template>

<script>
import Skills from '~/components/Skills';

export default {
  name: 'Header',
  components: { Skills },
  data() {
    return {
      showSkill: false
    };
  },
  computed: {
    fluents() {
      return ['Vue/Nuxt', 'React/Next', 'React Native'];
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: 20vh;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, #fafafa 0%, #eceff1 100%);
    border-radius: 0 0 50% 50% / 0 0 100% 100%;
    width: 100%;
    transition: all ease 0.4s;

    @media screen and (min-width: 960px) {
      width: 75vw;
      height: 35vh;
    }
  }

  &.extend:before {
    @media screen and (min-width: 960px) {
      height: 20vh;
    }
  }
}

.theme--dark.v-application {
  .header {
    &:before {
      background: linear-gradient(to bottom, #455a64 0%, #37474f 100%);
    }
  }
}
</style>
