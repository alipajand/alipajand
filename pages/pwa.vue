<template>
  <v-sheet class="h-screen intro-page" color="#fff">
    <v-sheet class="h-screen d-flex justify-center align-center" color="#fff">
      <v-fade-transition leave-absolute>
        <v-img alt="" contain max-width="60%" src="/images/icon.png" />
      </v-fade-transition>
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  layout: 'empty',
  created() {
    setTimeout(() => {
      return this.goInto();
    }, 3000);
  },
  methods: {
    goInto() {
      this.$router.push({ name: 'index' });
    }
  }
};
</script>

<style lang="scss" scoped></style>
