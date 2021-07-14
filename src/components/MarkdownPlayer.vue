<template>
  <div>
    <div ref="md"
         class="markdown-body"
         v-html="html" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import * as showdown from 'showdown';
import hljs from 'highlight.js';
import 'github-markdown-dracula-css/github-markdown-dracula.css';
import 'highlight.js/styles/github-dark-dimmed.css';
import { FileGetter } from 'src/store/github-data/getters';
import { createMarkdownVueComponent } from 'src/lib/CreateMarkdownVueComponent';

const converter: showdown.Converter = new showdown.Converter({
  rawPrefixHeaderId: true,
  excludeTrailingPunctuationFromURLs: true,
  tables: true,
  emoji: true
});
converter.setFlavor('github');

export default defineComponent({
  name: 'MarkdownPlayer',
  props: {
    markdown: {
      type: String,
      default: ''
    },
    idBase: {
      type: String,
      default: ''
    }
  },
  setup() {
    const renderedComponents = ref<{ unmount: (() => void) }[]>([]);
    return {
      renderedComponents
    };
  },
  computed: {
    html(): string {
      const fileGetter: FileGetter = this.$store.getters['GithubData/file'] as FileGetter;
      return converter.makeHtml(this.markdown)
        .replace(/<a(.*?)href="#(.*?)"(.*?)>/g, (line: string) => {
          // 规范化文章内导航
          const matches = /<a(.*?)href="#(.*?)"(.*?)>/.exec(line);
          if (matches)
            return `<a${matches[1]}href="${this.idBase}#${matches[2].toLowerCase()}"${matches[3]}>`;
          return line;
        })
        .replace(/<img(.*?)src="(.*?)"(.*?)>/g, (line: string) => {
          // 重定向文章内的图片
          // 本来应该用redirectImages()方法，但是会报404，有点强迫症不想看
          const matches = /<img(.*?)src="(.*?)"(.*?)>/.exec(line);
          if (matches)
            return `<img${matches[1]}src="${fileGetter(matches[2]) || matches[2]}"${matches[3]}>`;
          return line;
        })
    }
  },
  watch: {
    async html() {
      await this.renderVueComponent();
      this.highlightHtml();
    }
  },
  methods: {
    redirectImages() {
      const el = this.$refs.md as HTMLElement;
      if (el) {
        const fileGetter: FileGetter = this.$store.getters['GithubData/file'] as FileGetter;
        const blocks = el.querySelectorAll('img');
        blocks.forEach((block) => {
          const matches = /https?:\/\/.*\/(assets\/.*\.(jpg|png|webp|ico|gif|mp4|ogg))/.exec(block.src)
          if (matches)
            block.src = fileGetter(matches[1]) || block.src;
        });
      }
    },
    highlightHtml() {
      const el = this.$refs.md as HTMLElement;
      if (el) {
        const blocks = el.querySelectorAll('pre code');
        blocks.forEach((block) => {
          hljs.highlightBlock(block as HTMLElement);
        });
      }
    },
    async renderVueComponent() {
      this.unmountAll();
      await this.$nextTick(() => {
        const el = this.$refs.md as HTMLElement;
        if (el) {
          const blocks = el.querySelectorAll('p');
          const enabledComponents = [
            'server-card'
          ];
          const nextTickFunc: (() => void)[] = [];
          blocks.forEach((block) => {
            const regexp = new RegExp(`^:::\s*(${enabledComponents.join('|')})`);
            const blockMatches = regexp.exec(block.innerText);
            if (blockMatches) {
              const componentName = blockMatches[1];
              const lines = block.innerText.split(/[\r\n]/).filter(i => i.length > 0);
              const props: Record<string, unknown> = {};
              let start = false;
              for (const line of lines) {
                if (!start && new RegExp(`^:::\s*(${enabledComponents.join('|')})$`).test(line))
                  start = true;
                else if (/^:::$/.test(line)) break;
                else {
                  const matches = /^(.*?):(.*)$/.exec(line);
                  if (matches) {
                    const propName = matches[1].replace(/^\s*(.*)\s*$/, '$1');
                    matches[2] = matches[2].replace(/^\s*(.*)\s*$/, '$1');
                    const propValue: unknown =
                      (matches[2] === 'true') ? true :
                        (matches[2] === 'false') ? false :
                          (!isNaN(parseFloat(matches[2]))) ? parseFloat(matches[2]) :
                            (/^[{\[](.*)[}\]]$/.test(matches[2])) ? JSON.parse(matches[2]) :
                              matches[2];
                    props[propName] = propValue;
                  }
                }
              }
              nextTickFunc.push(() => {
                if (block.parentNode) {
                  try {
                    block.innerHTML = '';
                    const comp = createMarkdownVueComponent(block, componentName, {
                      title: 'A Play Server',
                      caption: 'A Server of Sonolus',
                      ...props
                    });
                    if (comp) {
                      comp.mount();
                      this.renderedComponents.push({ unmount: comp.unmount });
                    }
                  } catch (e) {
                  }
                }
              });
            }
          });
          for (const f of nextTickFunc) f();
          this.redirectImages();
        }
      })
    },
    unmountAll() {
      this.renderedComponents.forEach(c => {
        c.unmount();
      });
      this.renderedComponents = []
    }
  },
  async mounted() {
    await this.renderVueComponent();
    this.highlightHtml();
  },
  beforeUnmount() {
    this.unmountAll();
  }
});
</script>
