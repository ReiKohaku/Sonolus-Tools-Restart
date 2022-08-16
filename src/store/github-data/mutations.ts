import { MutationTree } from 'vuex';
import { GithubContentStateInterface, GithubContentDirInterface } from './state';

const mutation: MutationTree<GithubContentStateInterface> = {
  setFileTree(state: GithubContentStateInterface, payload: GithubContentDirInterface) {
    state.content = payload
  },
  setDefaultLang(state: GithubContentStateInterface, payload: { defaultLang: string }) {
    state.defaultLang = payload.defaultLang;
  },
  updateCache(state: GithubContentStateInterface, payload: { path: string, data: ArrayBuffer }) {
    const { path, data } = payload;
    state.cache[path] = data;
  }
};

export default mutation;
