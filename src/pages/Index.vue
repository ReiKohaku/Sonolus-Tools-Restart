<template>
  <q-page>
    <q-parallax style="height: 280px">
      <template v-slot:content="scope">
        <div class="absolute column items-center"
             :style="{
               opacity: 0.45 + (1 - scope.percentScrolled) * 0.55,
               top: (scope.percentScrolled * 60) + '%',
               left: 0,
               right: 0
             }">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div style="margin: 0 auto; width: 100%; max-width: 360px">
                <div>
                  <img src="img/logo-left.png" style="width: 19.75%" />
                  <img src="img/logo-right.png" style="margin-left: 2%; width: 78.25%" />
                </div>
              </div>
            </div>
            <div class="col-12 text-body text-bold text-white text-center">
              {{ $t('index.subtitle') }}
            </div>
          </div>
        </div>
      </template>
    </q-parallax>
    <div class="container">
      <div class="row q-col-gutter-md">
        <content-card class="col-12" :title="$t('index.broadcast.title')" dark>
          <markdown-player :markdown="readme" />
        </content-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ContentCard from 'components/ContentCard.vue';
import MarkdownPlayer from 'components/MarkdownPlayer.vue';
import { FileGetter } from 'src/store/github-data/getters';

export default defineComponent({
  name: 'PageIndex',
  components: { MarkdownPlayer, ContentCard },
  setup() {
    return {};
  },
  computed: {
    locale(): string {
      return this.$i18n.locale.toString();
    },
    defaultLang(): string {
      return this.$store.getters['GithubData/defaultLang'] as string
    },
    readme(): string {
      const fileGetter: FileGetter = this.$store.getters['GithubData/file'] as FileGetter;
      const readmeFile: string | null = fileGetter(`${this.$i18n.locale}/README.md`);
      if (readmeFile) return readmeFile;
      return fileGetter(`${this.defaultLang}/README.md`) || '';
    }
  }
});
</script>
