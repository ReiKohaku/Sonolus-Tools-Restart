import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GithubDataStateInterface, RepoTreeInterface } from './state';

export type FileGetter = (path: string) => string | null
const getters: GetterTree<GithubDataStateInterface<string>, StateInterface> = {
  file(context: GithubDataStateInterface<string>): FileGetter {
    function fileGetter(path: string): string | null {
      if (!context || !context.files) return null
      const split = path.replace(/^\/*(.*)/, '$1').split('/')
      let root: RepoTreeInterface<string> = context.files
      for (let i = 0; i < split.length; i++) {
        const name: string = split[i]
        if (i === split.length - 1) return root.files[name] || null
        else if (!root.dir[name]) return null
        else root = root.dir[name]
      }
      return null
    }
    return fileGetter
  },
  defaultLang(context: GithubDataStateInterface<string>): string {
    if (context && context.files && context.files.files['.defaultlang'])
      return context.files.files['.defaultlang']
    return 'en-US'
  }
};

export default getters;
