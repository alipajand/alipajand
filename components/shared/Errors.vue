<template>
  <v-row align="center" class="h-screen" justify="center" style="min-height: 300px">
    <v-col class="text-center" lg="4" sm="6">
      <h1 class="error-code mb-0 text-nowrap error--text">
        {{ errorCode }}
      </h1>
      <p class="error-text font-weight-bold">
        {{ errorText }}
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    errorCode() {
      if (!this.error) {
        return;
      }

      const status = Number(this.error.statusCode) || 404;
      const errors = [401, 403, 404, 410, 500, 503];
      if (errors.includes(status)) {
        return status;
      }

      return 404;
    },
    errorText() {
      switch (this.errorCode) {
        case 401:
          return 'Unauthorized';
        case 403:
          return 'Forbidden';
        case 404:
          return 'Page Not Found';
        case 500:
          return 'Internal Server Error';
        case 503:
          return 'Service Unavailable';
        default:
          return 'Something Bad Happened!';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.error-code {
  line-height: 1;
  font-size: 140px;
}

.error-text {
  font-size: 30px;
}
</style>
