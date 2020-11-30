<template>
  <div class="modal-card" style="width: 500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Connect To Device</p>
    </header>
    <section class="modal-card-body">
      <b-table
        :data="tableData">
        <b-table-column field="index" label="Device #" v-slot="props">
          {{ props.row.index }}
        </b-table-column>

        <b-table-column field="id" label="ID" v-slot="props">
          {{ props.row.id }}
        </b-table-column>

        <b-table-column v-slot="props">
          <b-button type="is-danger" v-on:click="connectToDevice(props.row.id)" v-if="!props.row.connected">Connect</b-button>
          <b-button type="is-success" v-on:click="connectToDevice(props.row.id)" v-else>Connected</b-button>
        </b-table-column>
      </b-table>
    </section>
    <footer class="modal-card-foot" style="display: flex;justify-content: flex-end">
      <b-button class="button" type="button" v-on:click="$parent.close()">Close</b-button>
    </footer>
  </div>  
</template>

<script>
import SerialState from '@/store/serial'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      serialModule: undefined,
      tableData: [
        { index: 0, id: 'lsakdjfh', connected: true }
      ]
    }
  },
  async mounted() {
    this.serialModule = getModule(SerialState, this.$store);
    this.serialModule.listPorts().then(x => console.log(x))
  },
  methods: {
  }
}
</script>