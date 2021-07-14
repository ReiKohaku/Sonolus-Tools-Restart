<template>
  <q-card :dark="dark || $q.dark.isActive">
    <q-card-section>
      <q-item>
        <q-item-section side>
          <q-icon
            :name="(typeof icon === 'string' && icon.length > 0) ? icon : 'img:icons/favicon-32x32.png'" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">{{ displayTitle }}</q-item-label>
          <q-item-label caption class="text-grey-2" v-html="displayCaption" v-if="displayCaption.length > 0" />
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section v-if="displayLinks">
      <q-list :dark="dark || $q.dark.isActive">
        <q-item v-for="(item, key) in displayLinks" :key="key" dark>
          <q-item-section side>
            <q-icon :name="item.icon || 'img:icons/favicon-32x32.png'" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn round flat icon="content_copy" @click="copy(item.link)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { copyToClipboard, Notify } from 'quasar';
import { defineComponent } from 'vue';

interface Link {
  name: string
  icon?: string
  link: string
}

export default defineComponent({
  name: 'ServerCard',
  props: {
    title: {},
    icon: {},
    caption: {},
    links: {
      type: Array
    },
    dark: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    displayTitle(): string {
      return this.multiGet(this.title, this.$t('server-card.default.title')) as string
    },
    displayCaption(): string {
      return this.multiGet(this.caption, '') as string
    },
    displayLinks(): Link[] | null {
      interface OriginalLink {
        name: string | Record<string, string>
        icon?: string
        link: string
      }
      if (!this.links) return null
      return (this.links as OriginalLink[]).map(link => {
        return {
          name: typeof link.name === 'object' ? this.multiGet(link.name, this.$t('server-card.default.link.name')) : link.name,
          icon: (link.icon && link.icon.length > 0) ? link.icon : undefined,
          link: link.link
        } as Link
      })
    }
  },
  methods: {
    multiGet<T>(prop: unknown, defaultVal: T): T | typeof prop {
      if (typeof prop === 'string' && prop.length > 0)
        return prop
      else if (prop && typeof prop === 'object' && Object.keys(prop).length > 0) {
        const propL = prop as Record<string, T>
        return propL[this.$i18n.locale.toString()] || propL[Object.keys(propL)[0]]
      }
      return defaultVal
    },
    copy(link: string): void {
      copyToClipboard(link).then(() => {
        Notify.create({
          type: 'positive',
          message: this.$t('success'),
          caption: this.$t('server-card.copy.success')
        })
      }).catch(() => {
        Notify.create({
          type: 'negative',
          message: this.$t('error'),
          caption: this.$t('server-card.copy.error')
        })
      });
    }
  }
});
</script>
