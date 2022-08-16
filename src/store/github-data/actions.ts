import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { GithubContentDirInterface, GithubContentStateInterface } from './state';
import { getRepoFile } from 'src/lib/GithubRes';
import { ab2str } from 'src/lib/Utils';

const actions: ActionTree<GithubContentStateInterface, StateInterface> = {
  async updateContent(context) {
    const contentData: ArrayBuffer = await getRepoFile('ReiKohaku', 'Sonolus-Tools-Data', 'main', 'content.json');
    const content: GithubContentDirInterface = JSON.parse(ab2str(contentData)) as GithubContentDirInterface;
    context.commit('setFileTree', content);
    return content;
  },
  async updateDefaultLang(context) {
    try {
      const contentData: ArrayBuffer = await getRepoFile('ReiKohaku', 'Sonolus-Tools-Data', 'main', '.defaultlang');
      context.commit('setDefaultLang', { defaultLang: ab2str(contentData) });
    } catch (e) {
      context.commit('setDefaultLang', { defaultLang: 'en-US' });
    }
  },
  async updateFile(context, payload: { path: string, lang: string }) {
    // 移除错误的斜杠、多余的斜杠、开头末尾的斜杠以保证路径正确
    const path = payload.path.replace('\\', '/').replace(/\/+/, '/').replace(/^\//, '').replace(/\/$/, '');
    if (context.state.cache[path]) return context.state.cache[path];
    else {
      try {
        const fileData = await getRepoFile('ReiKohaku', 'Sonolus-Tools-Data', 'main', path);
        context.commit('updateCache', { path, data: fileData });
        return context.state.cache[path];
      } catch (e) {
        const fileData = await getRepoFile('ReiKohaku', 'Sonolus-Tools-Data', 'main', `${context.state.defaultLang}` + path.slice(path.indexOf('/')));
        context.commit('updateCache', { path, data: fileData });
        return context.state.cache[path];
      }
    }
  }
};

export default actions;
