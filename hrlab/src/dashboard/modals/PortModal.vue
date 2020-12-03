<template>
  <div class="modal-card" style="width: 500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Connect To Device</p>
    </header>
    <section class="modal-card-body">
      Last connected device: {{serialNumber}}
      <b-table :data="tableData" v-if="serialModule.currentMode == 0">
        <b-table-column label="Path" v-slot="props">
          {{ props.row }}
        </b-table-column>

        <b-table-column v-slot="props">
          <b-button type="is-danger" v-on:click="serialModule.connect(props.row)">Connect</b-button>
        </b-table-column>
      </b-table>
      <div class="columns" v-if="serialModule.currentMode != 0">
        <div class="column">
          <p>Connected</p>
        </div>
        <div class="column">
          <b-button type="is-danger" v-on:click="serialModule.disconnect()">Disconnect</b-button>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot" style="display: flex;justify-content: flex-end">
      <b-button class="button" type="button" v-on:click="$parent.close()">Close</b-button>
    </footer>
  </div>  
</template>

<script>
import SerialState from '@/store/serial'
import AuthState from '@/store/auth'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      serialModule: {},
      tableData: [],
      authModule: {},
      serialNumber: ''
    }
  },
  async mounted() {
    this.serialModule = getModule(SerialState, this.$store);
    this.authModule = getModule(AuthState, this.$store);
    this.serialModule.listPorts().then(x => this.tableData = x);
    this.serialNumber = await this.authModule.getItem('serialNumber');
  },
  watch: {
    "serialModule.serialNumber": async function() {
      const serialNumber = this.serialModule.serialNumber;
      if(serialNumber.length == 8) {
        await this.authModule.setItem({ itemName: 'serialNumber', item: serialNumber });
      }
    },
  },
  methods: {
  }
}
</script>