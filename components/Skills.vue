<template>
  <v-sheet id="skills" class="rounded-xl w-full" max-width="600">
    <div class="pa-6">
      <div v-for="skill in skills" :key="skill.name" class="skill d-flex align-center animate slide-up mb-3">
        <div
          :class="[
            'skill-name grey--text text-no-wrap',
            isFa ? 'text-left ml-2' : 'text-right mr-2',
            isDark ? 'text--lighten-2' : 'text--darken-2'
          ]"
        >
          {{ skill.name }}
        </div>
        <v-progress-linear :color="skill.color || 'success'" :value="skill.rate" height="20" rounded striped>
          <template #default="{ value }">
            <small>{{ Math.ceil(value) }}%</small>
          </template>
        </v-progress-linear>
      </div>
    </div>
  </v-sheet>
</template>

<script>
export default {
  name: 'Skills',
  computed: {
    skills() {
      return [
        { name: 'Vue/Nuxt', rate: 95, color: '#41B883' },
        { name: 'React/Next', rate: 85, color: '#61DAFB' },
        { name: 'React Native', rate: 70, color: '#61DAFB' },
        { name: 'Typescript', rate: 70, color: '#61DAFB' },
        { name: 'Vuetify', rate: 95, color: '#1697F6' },
        { name: 'Bootstrap 4 & 5', rate: 95, color: '#533B78' },
        { name: 'Socket.io', rate: 85, color: 'warning' }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
#skills {
  box-shadow: 0 10px 5px rgba(0, 0, 0, 0.1);

  .skill {
    .skill-name {
      min-width: 120px;
    }
  }
}
</style>
