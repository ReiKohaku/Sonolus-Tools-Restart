<template>
  <q-layout view="hHh Lpr lff" v-if="loading">
    <q-page-container class="text-white" style="background-color: rgb(13, 0, 31)">
      <q-page class="flex flex-center">
        <q-item>
          <q-item-section side>
            <q-spinner />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('layout.loading') }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-page>
    </q-page-container>
  </q-layout>
  <q-layout view="hHh Lpr lff" v-else>
    <q-header bordered class="bg-black text-primary">
      <q-toolbar>
        <q-btn color="white" icon="menu" round flat @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-center">
          <div class="row q-gutter-sm items-center justify-center q-ma-sm">
            <img src="img/logo-left.png" style="height: 36px" />
            <img src="img/logo-right.png" style="height: 36px" />
          </div>
        </q-toolbar-title>
        <q-btn color="white" icon="translate" round flat @click="changeLang" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen"
              show-if-above
              elevated
              class="bg-black">
      <q-scroll-area class="fit">
        <q-list>
          <essential-link v-for="link in links"
                          class="text-white"
                          :key="link.name"
                          v-bind="link" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="text-white" style="background-color: rgb(13, 0, 31)">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import EssentialLink from 'components/EssentialLink.vue';

import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { updateQuasarLangPack } from 'boot/i18n';
import { LooseDictionary } from 'quasar/dist/types/ts-helpers';
import { LeftDrawerItem, LeftDrawerItemDir, LeftDrawerItemLink } from 'src/components/models';
import { RepoTreeInterface } from 'src/store/github-data/state';
import { getMarkdownFirstLine } from 'src/lib/Utils';

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const $q = useQuasar();
    const $i18n = useI18n({ useScope: 'global' });

    interface BottomSheetAction {
      classes?: string | unknown[] | LooseDictionary
      icon?: string
      img?: string
      avatar?: boolean
      label?: string | number
    }

    const changeLang = () => {
      $q.bottomSheet({
        message: $i18n.t('layout.changeLang.message'),
        actions: [
          {
            label: '简体中文',
            img: 'img/flags/cn.svg'
          },
          {
            label: 'English',
            img: 'img/flags/us.svg'
          },
          {
            label: '日本語',
            img: 'img/flags/jp.svg'
          }
        ]
      }).onOk((action: BottomSheetAction): void => {
        const localeList: Record<string, string> = {
          '简体中文': 'zh-CN',
          'English': 'en-US',
          '日本語': 'ja-JP'
        };
        const locale: string = localeList[action.label || 'English'] || 'en-US';
        $i18n.locale.value = locale;
        void updateQuasarLangPack(locale);
        $q.localStorage.set('locale', locale);
      });
    };
    const loading = ref<boolean>(true);
    return {
      changeLang,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      loading
    };
  },
  computed: {
    githubData(): RepoTreeInterface<string> | null {
      return this.$store.state.GithubData.files;
    },
    defaultLang(): string {
      return this.$store.getters['GithubData/defaultLang'] as string;
    },
    links: {
      get(): LeftDrawerItem[] {
        const list: LeftDrawerItem[] = [];
        const githubData: RepoTreeInterface<string> | null = this.githubData;
        if (githubData) {
          function createLinksTree(path: string, name: string, node: RepoTreeInterface<string>): LeftDrawerItemDir {
            path = path.endsWith('/') ? `${path}${name}` : `${path}/${name}`;
            path = path.endsWith('/') ? path : `${path}/`;
            const dir: LeftDrawerItemDir = {
              type: 'dir',
              name: node.files['.dirname'] || name,
              links: []
            };
            for (const f in node.files) {
              if (/^\.(.*)/.test(f)) continue;
              else if (!/.md$/.test(f)) continue;
              const name: string = getMarkdownFirstLine(node.files[f]);
              const fileLink: LeftDrawerItemLink = {
                name: name,
                link: `${path}${f === 'README.md' ? '' : f}`.replace(/(.*)\.md$/, '$1')
              };
              dir.links.push(fileLink);
            }
            for (const d in node.dir) {
              if (/^_/.test(d)) continue;
              dir.links.push(createLinksTree(`${path}`, d, node.dir[d]));
            }
            return dir;
          }

          if (githubData.dir[this.defaultLang])
            list.push(...createLinksTree('/', '', githubData.dir[this.defaultLang]).links);
        }
        return list;
      },
      set() {
        // Do nothing
      }
    }
  },
  async mounted() {
    this.loading = true;
    try {
      await this.$store.dispatch('GithubData/updateGithubData');
    } catch (e) {
      // Do nothing
      console.error(e);
    } finally {
      this.loading = false;
    }
  }
});
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: darkslateblue;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}
</style>
