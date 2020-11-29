<template>
  <div>
    <section class="section">
        <b-field label="Pulse Rate" type="is-danger">
          <b-input type="number" placeholder="Pulse Rate..." v-model="pulseRate" min="30" max="175"></b-input>
        </b-field>
        <b-field label="Ventricular Amplitude" type="is-danger">
          <b-input type="number" placeholder="Ventricular Amplitude..." v-model="ventricularAmplitude" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <b-field label="Ventricular Pulse Width" type="is-danger">
          <b-input type="number" placeholder="Ventricular Pulse Width..." v-model="ventricularPulseWidth" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <b-field label="Atrial Amplitude" type="is-danger">
          <b-input type="number" placeholder="Atrial Amplitude..." v-model="atrialAmplitude" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <b-field label="Atrial Pulse Width" type="is-danger">
          <b-input type="number" placeholder="Atrial Pulse Width..." v-model="atrialPulseWidth" min="0.5" max="5" step="any"></b-input>
        </b-field>
        <b-field label="AV Delay" type="is-danger">
          <b-input type="number" placeholder="AV Delay..." v-model="AVDelay" min="20" max="300"></b-input>
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
      ventricularAmplitude: undefined,
      ventricularPulseWidth: undefined,
      atrialAmplitude: undefined,
      atrialPulseWidth: undefined,
      hysteresisPacingRate: undefined,
      pulseRate: undefined,
      AVDelay: undefined
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
      user.DOO.atrialAmplitude != undefined ? this.atrialAmplitude = user.DOO.atrialAmplitude : null;
      user.DOO.atrialPulseWidth != undefined ? this.atrialPulseWidth = user.DOO.atrialPulseWidth : null;
      user.DOO.ventricularAmplitude != undefined ? this.ventricularAmplitude = user.DOO.ventricularAmplitude : null;
      user.DOO.ventricularPulseWidth != undefined ? this.ventricularPulseWidth = user.DOO.ventricularPulseWidth : null;
      user.DOO.showHysteresisField != undefined ? this.showHysteresisField = user.DOO.showHysteresisField : null;
      user.DOO.hysteresisPacingRate != undefined ? this.hysteresisPacingRate = user.DOO.hysteresisPacingRate : null;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.DOO = {
        pulseRate: this.pulseRate,
        ventricularPulseWidth: this.ventricularPulseWidth,
        ventricularAmplitude: this.ventricularAmplitude,
        atrialAmplitude: this.atrialAmplitude,
        atrialPulseWidth: this.atrialPulseWidth,
        AVDelay: this.AVDelay,
        showHysteresisField: this.showHysteresisField,
        hysteresisPacingRate: this.hysteresisPacingRate
      }
      // save to storage
      this.authModule.updateCurrentUser(user);
    }
  }
}

  
</script>
