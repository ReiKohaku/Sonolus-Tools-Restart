import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';
import { LocalStorage, Quasar, QuasarLanguage } from 'quasar';

const localeList = ['en-US', 'zh-CN', 'ja-JP'];
const locale: string = (() => {
  const storageLocale = LocalStorage.getItem('locale');
  if (typeof storageLocale === 'string' && localeList.includes(storageLocale)) return storageLocale;
  return Quasar.lang.getLocale() || 'en-US';
})();

export async function updateQuasarLangPack(locale: string): Promise<void> {
  try {
    const langIso: Record<string, string> = {
      'ja-JP': 'ja'
    }
    const lang: unknown = await import('quasar/lang/' + (langIso[locale] || locale));
    if (lang) Quasar.lang.set((lang as {default: QuasarLanguage}).default);
  } catch {
    // Do nothing
  }
}

void updateQuasarLangPack(locale)
const i18n = createI18n({
  legacy: false,
  locale,
  messages
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
