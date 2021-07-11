<template>
  <div class="d-flex justify-space-between align-center mt-2">
    <v-btn
      v-for="social in socials"
      :key="social.name"
      :color="social.color"
      :href="social.href"
      :title="social.name"
      class="animate zoom-in mx-1"
      icon
      target="_blank"
    >
      <v-icon>{{ social.icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  computed: {
    socials() {
      return [
        { name: 'Mail', href: 'mailto:ali.pajand@gmail.com', color: '#DB4437', icon: 'fa fa-envelope' },
        { name: 'Linkedin', href: 'https://www.linkedin.com/in/alipajand/', color: '#003687', icon: 'fab fa-linkedin' },
        { name: 'Telegram', href: 'https://t.me/alipajand', color: '#0088cc', icon: 'fab fa-telegram' },
        { name: 'Github', href: 'https://github.com/alipajand', color: '#000', icon: 'fab fa-github' },
        { name: 'Gitlab', href: 'https://gitlab.com/alipajand', color: 'warning', icon: 'fab fa-gitlab' }
      ];
    }
  }
};
</script>

<style scoped></style>
