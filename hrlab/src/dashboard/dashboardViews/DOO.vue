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
        <div class="field">
          <b-checkbox v-model="showRateAdaptation" type="is-danger">
            Rate Adaptation
          </b-checkbox>
        </div>
        <div v-if="showRateAdaptation" style="margin-bottom: 20px;">
          <b-field label="Maximum Sensor Rate" type="is-danger">
            <b-input type="number" placeholder="Maximum Sensor Rate..." v-model="maximumSensorRate" min="50" max="175" step="1"></b-input>
          </b-field>
          <b-field label="Activity Threshold" type="is-danger">
            <b-input type="number" placeholder="Activity Threshold..." v-model="activityThreshold" min="1" max="4" step="0.001"></b-input>
          </b-field>
          <b-field label="Reaction Time" type="is-danger">
            <b-input type="number" placeholder="Reaction Time..." v-model="reactionTime" min="10" max="50" step="10"></b-input>
          </b-field>
          <b-field label="Recovery Time" type="is-danger">
            <b-input type="number" placeholder="Recovery Time..." v-model="recoveryTime" min="2" max="16" step="1"></b-input>
          </b-field>
          <b-field label="Response Factor" type="is-danger">
            <b-input type="number" placeholder="Response Factor..." v-model="responseFactor" min="1" max="16" step="1"></b-input>
          </b-field>
        </div>
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
      AVDelay: undefined,
      showRateAdaptation: false,
      maximumSensorRate: undefined,
      activityThreshold: undefined,
      reactionTime: undefined,
      recoveryTime: undefined,
      responseFactor: undefined
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
      user.DOO.showRateAdaptation != undefined ? this.showRateAdaptation = user.DOO.showRateAdaptation : null;
      user.DOO.maximumSensorRate != undefined ? this.maximumSensorRate = user.DOO.maximumSensorRate : null;
      user.DOO.activityThreshold != undefined ? this.activityThreshold = user.DOO.activityThreshold : null;
      user.DOO.reactionTime != undefined ? this.reactionTime = user.DOO.reactionTime : null;
      user.DOO.recoveryTime != undefined ? this.recoveryTime = user.DOO.recoveryTime : null;
      user.DOO.responseFactor != undefined ? this.responseFactor = user.DOO.responseFactor : null;
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
        hysteresisPacingRate: this.hysteresisPacingRate,
        showRateAdaptation: this.showRateAdaptation,
        maximumSensorRate: this.maximumSensorRate,
        activityThreshold: this.activityThreshold,
        reactionTime: this.reactionTime,
        recoveryTime: this.recoveryTime,
        responseFactor: this.responseFactor
      }
      // save to storage
      this.authModule.updateCurrentUser(user);
    }
  }
}

  
</script>
