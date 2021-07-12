<template>
  <v-sheet class="h-screen" />
</template>

<script>
export default {
  layout: 'empty',
  created() {
    setTimeout(() => {
      return this.goInto();
    }, 1000);
  },
  methods: {
    goInto() {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss" scoped></style>
