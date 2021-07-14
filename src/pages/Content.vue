<template>
  <q-page>
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
import { defineComponent, ref } from 'vue';
import { FileGetter } from 'src/store/github-data/getters';
import { useI18n } from 'vue-i18n';
import IndexParallax from 'components/IndexParallax.vue';

export default defineComponent({
  name: 'Content',
  components: { IndexParallax, MarkdownPlayer },
  setup() {
    const $i18n = useI18n({
      useScope: 'global'
    });
    const actualLocale = ref<string>($i18n.locale.value);
    const closeTip = ref<boolean>(false);
    return {
      actualLocale,
      closeTip
    };
  },
  computed: {
    locale(): string {
      return this.$i18n.locale.toString();
    },
    defaultLang(): string {
      return this.$store.getters['GithubData/defaultLang'] as string;
    },
    translateNeededTip(): string {
      return this.$t('content.translate-needed', {
        locale: `<b>${this.$t(this.actualLocale)}</b>`,
        warehouse: `<a href="https://github.com/ReiKohaku/Sonolus-Tools-Data">${this.$t('content.warehouse')}</a>` })
    },
    markdown(): string {
      const fileGetter: FileGetter = this.$store.getters['GithubData/file'] as FileGetter;
      const path: string = this.$route.path.endsWith('/') ? '/README' : this.$route.path;
      const markdownFile: string | null = fileGetter(`${this.$i18n.locale}${path}.md`);
      if (markdownFile) {
        this.setTip(this.$i18n.locale);
        return markdownFile;
      } else {
        this.setTip(this.defaultLang);
        return fileGetter(`${this.defaultLang}${path}.md`) || '';
      }
    }
  },
  methods: {
    setTip(actualLocale: string) {
      this.actualLocale = actualLocale;
      this.closeTip = false;
    }
  }
});
</script>

<style scoped>

</style>
