<template>
  <Errors :error="{ statusCode: $route.params.id }" />
</template>
<script>
import Errors from '~/components/shared/Errors';

export default {
  components: {
    Errors
  },
  layout: 'empty',
  scrollToTop: true,
  head() {
    return {
      title: `Error ${this.$route.params.id}`,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `Error ${this.$route.params.id}`
        }
      ]
    };
  }
};
</script>
