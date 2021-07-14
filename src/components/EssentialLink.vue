<template>
  <q-expansion-item v-model="expand"
                    :label="name"
                    v-if="typeof type === 'string' && type.toLowerCase() === 'dir'">
    <div class="q-ml-md">
      <essential-link v-for="sublink in links" :key="sublink.name" v-bind="sublink" />
    </div>
  </q-expansion-item>
  <q-item :class="($route.path === link) ? 'bg-grey-10 text-bold' : ''" clickable @click="goto" v-else>
    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  setup() {
    const expand = ref<boolean>(false);
    return {
      expand
    };
  },
  props: {
    type: {
      type: String,
      default: 'link'
    },
    name: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: '/'
    },
    links: {
      type: Array
    }
  },
  methods: {
    async goto() {
      try {
        void await this.$router.push(this.link);
      } catch (e) {
        window.location.href = this.link;
      }
    }
  }
});
</script>
