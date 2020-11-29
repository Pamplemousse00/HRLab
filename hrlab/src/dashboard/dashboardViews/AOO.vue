<template>
  <div>
    <section class="section">
        <b-field label="Lower Rate Limit" type="is-danger">
          <b-input type="number" placeholder="Lower Rate Limit..." v-model="lowerRateLimit" min="30" max="175"></b-input>
        </b-field>
        <b-field label="Upper Rate Limit" type="is-danger">
          <b-input type="number" placeholder="Upper Rate Limit..." v-model="upperRateLimit" min="50" max="175"></b-input>
        </b-field>
        <b-field label="Atrial Amplitude" type="is-danger">
          <b-input type="number" placeholder="Atrial Amplitude..." v-model="atrialAmplitude" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <b-field label="Atrial Pulse Width" type="is-danger">
          <b-input type="number" placeholder="Atrial Pulse Width..." v-model="atrialPulseWidth" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <button class="button is-danger is-fullwidth" v-on:click="saveData()">Save</button>
    </section>
  </div>
</template>

<script>

import AuthState from '@/store/auth'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      authModule: undefined,
      showHysteresisField: false,
      lowerRateLimit: undefined,
      upperRateLimit: undefined,
      atrialAmplitude: undefined
    }
  },
  mounted() {
    this.authModule = getModule(AuthState, this.$store);
    this.getData();
  },
  methods: {
    async getData() {
      // run on init, prefills textboxes with data from user's storage
      var user = await this.authModule.getCurrentUser();
      console.log(user);
      user.AOO.lowerRateLimit != undefined ? this.lowerRateLimit = user.AOO.lowerRateLimit : null;
      user.AOO.upperRateLimit != undefined ? this.upperRateLimit = user.AOO.upperRateLimit : null;
      user.AOO.atrialAmplitude != undefined ? this.atrialAmplitude = user.AOO.atrialAmplitude : null;
      user.AOO.atrialPulseWidth != undefined ? this.atrialPulseWidth = user.AOO.atrialPulseWidth : null;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.AOO = {
        lowerRateLimit: this.lowerRateLimit,
        upperRateLimit: this.upperRateLimit,
        atrialAmplitude: this.atrialAmplitude,
        atrialPulseWidth: this.atrialPulseWidth
      }
      // save to storage
      this.authModule.updateCurrentUser(user);
    }
  }
}

  
</script>
