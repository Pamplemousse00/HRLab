<template>
  <div>
    <section class="section">
        <b-field label="Lower Rate Limit" type="is-danger">
          <b-input type="number" placeholder="Lower Rate Limit..." v-model="lowerRateLimit" min="30" max="175"></b-input>
        </b-field>
        <b-field label="Upper Rate Limit" type="is-danger">
          <b-input type="number" placeholder="Upper Rate Limit..." v-model="upperRateLimit" min="50" max="175"></b-input>
        </b-field>
        <b-field label="Ventricular Amplitude" type="is-danger">
          <b-input type="number" placeholder="Ventricular Amplitude..." v-model="ventricularAmplitude" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <b-field label="Ventricular Pulse Width" type="is-danger">
          <b-input type="number" placeholder="Ventricular Pulse Width..." v-model="ventricularPulseWidth" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <b-field label="VRP" type="is-danger">
          <b-input type="number" placeholder="VRP..." v-model="vrp" min="150" max="500"></b-input>
        </b-field>
        <div class="field">
          <b-checkbox v-model="showHysteresisField" type="is-danger">
            Hysteresis Pacing
          </b-checkbox>
        </div>
        <b-field label="Hysteresis Pacing Rate" v-if="showHysteresisField" type="is-danger">
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
      ventricularAmplitude: undefined,
      ventricularPulseWidth: undefined,
      vrp: undefined,
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
      user.VVI.lowerRateLimit != undefined ? this.lowerRateLimit = user.VVI.lowerRateLimit : null;
      user.VVI.upperRateLimit != undefined ? this.upperRateLimit = user.VVI.upperRateLimit : null;
      user.VVI.ventricularAmplitude != undefined ? this.ventricularAmplitude = user.VVI.ventricularAmplitude : null;
      user.VVI.ventricularPulseWidth != undefined ? this.ventricularPulseWidth = user.VVI.ventricularPulseWidth : null;
      user.VVI.vrp != undefined ? this.vrp = user.VVI.vrp : null;
      user.VVI.showHysteresisField != undefined ? this.showHysteresisField = user.VVI.showHysteresisField : null;
      user.VVI.hysteresisPacingRate != undefined ? this.hysteresisPacingRate = user.VVI.hysteresisPacingRate : null;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.VVI = {
        lowerRateLimit: this.lowerRateLimit,
        upperRateLimit: this.upperRateLimit,
        ventricularAmplitude: this.ventricularAmplitude,
        ventricularPulseWidth: this.ventricularPulseWidth,
        vrp: this.vrp,
        showHysteresisField: this.showHysteresisField,
        hysteresisPacingRate: this.hysteresisPacingRate
      }
      // save to storage
      this.authModule.updateCurrentUser(user);
    }
  }
}

  
</script>
