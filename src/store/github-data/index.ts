import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { GithubDataStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const githubDataModule: Module<GithubDataStateInterface<string>, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default githubDataModule;
