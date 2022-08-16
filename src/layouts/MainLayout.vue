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

import { computed, ComputedRef, defineComponent, onMounted, Ref, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { updateQuasarLangPack } from 'boot/i18n';
import { LeftDrawerItem } from 'src/components/models';
import { GithubContentDirInterface } from 'src/store/github-data/state';
import { useStore } from 'src/store';

export default defineComponent({
  name: 'MainLayout',
  components: {
    EssentialLink
  },
  setup() {
    const leftDrawerOpen: Ref<boolean> = ref(false);
    const $q = useQuasar();
    const $i18n = useI18n({ useScope: 'global' });
    const $store = useStore();

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
      }).onOk((action): void => {
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
    const links = ref<LeftDrawerItem[]>([]);

    const lang: ComputedRef<string> = computed(() => $i18n.locale.value as string);
    const defaultLang: ComputedRef<string> = computed(() => $store.getters['GithubData/defaultLang'] as string);
    watch($store.state.GithubData, () => {
      if (!$store.state.GithubData.content) return [];
      const list: LeftDrawerItem[] = [];
      const content: GithubContentDirInterface = $store.state.GithubData.content;
      function dfs(parent: LeftDrawerItem[], child: GithubContentDirInterface, path: string) {
        child.files.forEach(f => {
          parent.push({
            type: 'link',
            name: f.title,
            link: path + (path.endsWith('/') ? '' : '/') + ((f.name.toLowerCase() === 'readme') ? '' : f.name)
          });
        });
        if (child.dir) for (const i in child.dir) {
          if (!child.dir[i]) continue;
          const links: LeftDrawerItem[] = [];
          dfs(links, child.dir[i], path + (path.endsWith('/') ? '' : '/') + i);
          parent.push({
            type: 'dir',
            name: child.dir[i].title,
            links
          })
        }
      }
      dfs(list, content, '/');
      links.value = list;
    });

    onMounted(async () => {
      loading.value = true;
      try {
        await $store.dispatch('GithubData/updateDefaultLang');
        await $store.dispatch('GithubData/updateContent');
      } catch (e) {
        // Do nothing
        console.error(e);
      } finally {
        loading.value = false;
      }
    })

    return {
      changeLang,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      loading,
      links,
      lang,
      defaultLang
    };
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
