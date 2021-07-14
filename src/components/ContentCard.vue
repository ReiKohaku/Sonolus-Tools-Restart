<template>
  <div>
    <q-card :dark="dark">
      <q-card-section v-if="title">
        <div class="text-h6">
          {{ title }}
        </div>
      </q-card-section>
      <q-card-section>
        <slot />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ContentCard',
  props: {
    title: {
      type: String,
      required: false
    },
    dark: {
      type: Boolean,
      default: true
    }
  }
});
</script>

<style scoped>

</style>
