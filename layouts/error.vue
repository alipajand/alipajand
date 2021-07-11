<template>
  <Errors :error="error" />
</template>
<script>
import Errors from '~/components/shared/Errors';

export default {
  components: {
    Errors
  },
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  head() {
    return {
      title: 'Error!',
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Error!'
        }
      ]
    };
  }
};
</script>
