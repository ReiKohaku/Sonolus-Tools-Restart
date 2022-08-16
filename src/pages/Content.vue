<template>
  <q-page v-if="loading" class="flex flex-center">
    <q-item>
      <q-item-section side>
        <q-spinner />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ $t("layout.loading") }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-page>
  <q-page v-else>
    <q-item clickable v-ripple class="bg-yellow-8" v-show="actualLocale !== $i18n.locale && !closeTip">
      <q-item-section avatar>
        <q-avatar rounded>
          <img src="icons/favicon-128x128.png">
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label v-html="translateNeededTip" />
      </q-item-section>

      <q-item-section side>
        <q-btn round flat icon="clear" @click="closeTip = true" />
      </q-item-section>
    </q-item>
    <div class="container">
      <index-parallax v-if="$route.path === '/'" />
      <markdown-player :markdown="markdown"
                       :id-base="'/' + ($route.params.path === '/') ? '' : $route.params.name.join('/')"
                       v-if="markdown.length > 0" />
    </div>
  </q-page>
</template>

<script lang="ts">
import MarkdownPlayer from 'components/MarkdownPlayer.vue';
import { computed, ComputedRef, defineComponent, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import IndexParallax from 'components/IndexParallax.vue';
import { useStore } from 'src/store';
import { useRoute, useRouter } from 'vue-router';
import { ab2str } from 'src/lib/Utils';

export default defineComponent({
  name: 'ContentPage',
  components: { IndexParallax, MarkdownPlayer },
  setup() {
    const $i18n = useI18n({
      useScope: 'global'
    });
    const $store = useStore();
    const $route = useRoute();
    const $router = useRouter();

    const actualLocale: Ref<string> = ref<string>($i18n.locale.value as string);
    const closeTip: Ref<boolean> = ref<boolean>(false);
    const loading: Ref<boolean> = ref<boolean>(false);
    const markdown: Ref<string> = ref<string>('');

    const lang: ComputedRef<string> = computed(() => $i18n.locale.value as string);
    const defaultLang: ComputedRef<string> = computed(() => $store.getters['GithubData/defaultLang'] as string);
    const translateNeededTip: ComputedRef<string> = computed(() => $i18n.t('content.translate-needed', {
        locale: `<b>${$i18n.t(actualLocale.value)}</b>`,
        warehouse: `<a href="https://github.com/ReiKohaku/Sonolus-Tools-Data">${$i18n.t('content.warehouse')}</a>`
      })
    );
    watch($route, async () => {
      loading.value = true;
      try {
        const path: string = $route.path.endsWith('/') ? ($route.path + 'README') : $route.path;
        const fullPath = `${$i18n.locale.value as string}${path}.md`;
        await $store.dispatch('GithubData/updateFile', { path: `${$i18n.locale.value as string}${path}.md` });
        const markdownFile: ArrayBuffer = $store.state.GithubData.cache[fullPath];
        if (markdownFile) {
          setTip($i18n.locale.value as string);
          markdown.value = ab2str(markdownFile);
        } else {
          setTip(defaultLang.value);
          markdown.value = ab2str($store.state.GithubData.cache[`${defaultLang.value}${path}.md`]) || '';
        }
      } catch (e) {
        // Do Nothing
        await $router.push('/')
      } finally {
        loading.value = false;
      }
    }, {
      immediate: true
    });

    function setTip(locale: string) {
      actualLocale.value = locale;
      closeTip.value = false;
    }

    return {
      actualLocale,
      closeTip,
      loading,
      lang,
      defaultLang,
      translateNeededTip,
      markdown
    };
  },
  methods: {}
});
</script>

<style scoped>

</style>
