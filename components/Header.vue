<template>
  <div :class="['header d-flex flex-column justify-center align-center w-full', { extend: showSkill }]">
    <img :alt="$t('brandName')" class="animate zoom" height="220" src="/images/avatar-transparent.png" />
    <h1
      :class="['mt-8 mb-3 animate slide-down delay-1 text-h4 font-weight-bold', isDark ? 'white--text' : 'black--text']"
    >
      {{ $t('brandName') }}
    </h1>
    <h4
      :class="[
        'grey--text text-h6 mt-3 mb-2 animate slide-up text-center font-weight-bold',
        isDark ? 'text--lighten-5' : 'text--darken-3'
      ]"
    >
      {{ $t('brandDesc') }}
    </h4>
    <div class="d-flex align-center flex-column justify-center latin w-full">
      <h5
        :class="[
          'grey--text text-body-1 animate slide-up d-flex flex-wrap justify-center align-center',
          isDark ? 'text--lighten-3' : 'text--darken-1'
        ]"
      >
        <span v-for="(item, i) in fluents" :key="i" class="px-1">{{ item }}</span>
      </h5>

      <v-btn class="animate flip-in-x mt-6 text-transform-none" large rounded small text @click="showSkills">
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
  },
  methods: {
    showSkills() {
      this.showSkill = !this.showSkill;

      try {
        if (this.showSkill) {
          setTimeout(() => {
            this.$vuetify.goTo('#skills', { duration: 2000 });
          }, 100);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  &:before {
    content: '';
    top: 0;
    left: 50%;
    width: 100%;
    height: 30vh;
    position: absolute;
    transition: all ease 0.4s;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, #fafafa 0%, #eceff1 100%);
    border-radius: 0 0 50% 50% / 0 0 100% 100%;

    @media screen and (min-width: 960px) {
      width: 90vw;
      height: 40vh;
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
