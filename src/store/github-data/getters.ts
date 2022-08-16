import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { GithubContentStateInterface } from './state';

export type FileGetter = (path: string) => string | null
const getters: GetterTree<GithubContentStateInterface, StateInterface> = {
  defaultLang(context: GithubContentStateInterface): string {
    return context.defaultLang;
  }
};

export default getters;
