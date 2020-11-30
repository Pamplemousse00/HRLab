import {
  Module, VuexModule, Mutation, Action,
} from 'vuex-module-decorators';

@Module({
  name: 'serial',
  namespaced: true,
})
export default class SerialState extends VuexModule {

  @Action({ rawError: true })
  getConnectedDevice() {
    return undefined;
  }
}
