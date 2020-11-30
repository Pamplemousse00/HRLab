import Vue from 'vue';
import Vuex from 'vuex';
import { config } from 'vuex-module-decorators';

import AuthState from './auth';
import SerialState from './serial';

config.rawError = true;

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: AuthState,
    serial: SerialState
  },
});
