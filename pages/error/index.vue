<template>
  <Errors :error="{ statusCode: 404 }" />
</template>
<script>
import Errors from '~/components/shared/Errors';

export default {
  components: {
    Errors
  },
  layout: 'empty',
  scrollToTop: true,
  fetch({ redirect }) {
    return redirect({
      name: 'error-id',
      params: { id: '404' }
    });
  }
};
</script>
