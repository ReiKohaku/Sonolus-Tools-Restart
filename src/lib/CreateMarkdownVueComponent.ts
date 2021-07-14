import { createApp, Component, App } from 'vue';
import ServerCard from 'src/components/ServerCard.vue';
import { Quasar } from 'quasar';
import { i18n } from 'boot/i18n';

export function createMarkdownVueComponent(parentDom: Node, componentName: string, props?: Record<string, unknown> | null): { mount: (() => void), unmount: (() => void) } | null {
  let temp: Component | null = null;
  switch (componentName) {
    case 'server-card':
      temp = ServerCard;
      break;
  }
  if (!temp) return null;

  const app: App<typeof temp> = createApp(ServerCard, {
    ...props
  });
  app.use(Quasar)
  app.use(i18n)
  const newDom = document.createElement('div')
  newDom.className = 'q-mt-md'
  parentDom.appendChild(newDom);
  return {
    mount: () => {
      app.mount(newDom)
    },
    unmount: () => {
      app.unmount();
      parentDom.removeChild(newDom);
    }
  };
}
