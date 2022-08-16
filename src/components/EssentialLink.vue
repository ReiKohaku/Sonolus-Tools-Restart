<template>
  <q-expansion-item v-model="expand"
                    :label="displayName"
                    v-if="typeof type === 'string' && type.toLowerCase() === 'dir'">
    <div class="q-ml-md">
      <essential-link v-for="sublink in links" :key="sublink.name" v-bind="sublink" />
    </div>
  </q-expansion-item>
  <q-item :class="($route.path === link) ? 'bg-grey-10 text-bold' : ''" clickable @click="goto" v-else>
    <q-item-section>
      <q-item-label>{{ displayName }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'EssentialLink',
  setup(props) {
    const { name, link } = toRefs(props);

    const $i18n = useI18n({
      useScope: 'global'
    });
    const $store = useStore();
    const $router = useRouter();

    const expand = ref<boolean>(false);
    const lang: ComputedRef<string> = computed(() => $i18n.locale.value as string);
    const defaultLang: ComputedRef<string> = computed(() => $store.getters['GithubData/defaultLang'] as string);

    const displayName = computed((): string => {
      if (!name.value) return '';
      if (typeof name.value === 'string') return name.value;
      else if (typeof name.value === 'object') {
        const n: Record<string, string> = name.value as Record<string, string>;
        return n[lang.value] || n[defaultLang.value];
      }
      return '';
    })

    async function goto() {
      if (!props.link) return;
      try {
        void await $router.push(link.value);
      } catch (e) {
        window.location.href = link.value;
      }
    }

    return {
      expand,
      displayName,
      goto
    };
  },
  props: {
    type: {
      type: String,
      default: 'link'
    },
    name: {
      required: true
    },
    link: {
      type: String,
      default: '/'
    },
    links: {
      type: Array
    }
  }
});
</script>
