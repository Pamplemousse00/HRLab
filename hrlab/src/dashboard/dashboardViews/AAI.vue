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
        <b-field label="ARP" type="is-danger">
          <b-input type="number" placeholder="ARP..." v-model="ARP" min="150" max="500"></b-input>
        </b-field>
        <div class="field">
          <b-checkbox v-model="showHysteresisField" type="is-danger">
            Hysteresis Pacing
          </b-checkbox>
        </div>
        <b-field label="Hysteresis Pacing Rate" v-if="showHysteresisField">
          <b-input type="number" placeholder="Hysteresis Pacing Rate..." v-model="hysteresisPacingRate" min="30" max="175"></b-input>
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
      atrialAmplitude: undefined,
      atrialPulseWidth: undefined,
      arp: undefined,
      hysteresisPacingRate: undefined
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
      user.AAI.lowerRateLimit != undefined ? this.lowerRateLimit = user.AAI.lowerRateLimit : null;
      user.AAI.upperRateLimit != undefined ? this.upperRateLimit = user.AAI.upperRateLimit : null;
      user.AAI.atrialAmplitude != undefined ? this.atrialAmplitude = user.AAI.atrialAmplitude : null;
      user.AAI.atrialPulseWidth != undefined ? this.atrialPulseWidth = user.AAI.atrialPulseWidth : null;
      user.AAI.arp != undefined ? this.ARP = user.AAI.arp : null;
      user.AAI.showHysteresisField != undefined ? this.showHysteresisField = user.AAI.showHysteresisField : null;
      user.AAI.hysteresisPacing != undefined ? this.hysteresisPacingRate = user.AAI.hysteresisPacing : null;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.AAI = {
        lowerRateLimit: this.lowerRateLimit,
        upperRateLimit: this.upperRateLimit,
        atrialAmplitude: this.atrialAmplitude,
        atrialPulseWidth: this.atrialPulseWidth,
        arp: this.arp,
        showHysteresisField: this.showHysteresisField,
        hysteresisPacingRate: this.hysteresisPacingRate
      }
      // save to storage
      this.authModule.updateCurrentUser(user);
    }
  }
}

  
</script>
