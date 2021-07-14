import { MutationTree } from 'vuex';
import { GithubDataStateInterface, RepoTreeInterface } from './state';

const mutation: MutationTree<GithubDataStateInterface<string>> = {
  setFileTree (state: GithubDataStateInterface<string>, payload: RepoTreeInterface<string>) {
    state.files = payload
  }
};

export default mutation;
