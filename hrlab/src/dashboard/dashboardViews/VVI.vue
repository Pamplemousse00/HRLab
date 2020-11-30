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
      lowerRateLimit: undefined,
      upperRateLimit: undefined,
      ventricularAmplitude: undefined,
      ventricularPulseWidth: undefined,
      vrp: undefined,
      hysteresisPacingRate: undefined,
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
      user.VVI.lowerRateLimit != undefined ? this.lowerRateLimit = user.VVI.lowerRateLimit : null;
      user.VVI.upperRateLimit != undefined ? this.upperRateLimit = user.VVI.upperRateLimit : null;
      user.VVI.ventricularAmplitude != undefined ? this.ventricularAmplitude = user.VVI.ventricularAmplitude : null;
      user.VVI.ventricularPulseWidth != undefined ? this.ventricularPulseWidth = user.VVI.ventricularPulseWidth : null;
      user.VVI.vrp != undefined ? this.vrp = user.VVI.vrp : null;
      user.VVI.showHysteresisField != undefined ? this.showHysteresisField = user.VVI.showHysteresisField : null;
      user.VVI.hysteresisPacingRate != undefined ? this.hysteresisPacingRate = user.VVI.hysteresisPacingRate : null;
      user.VVI.showRateAdaptation != undefined ? this.showRateAdaptation = user.VVI.showRateAdaptation : null;
      user.VVI.maximumSensorRate != undefined ? this.maximumSensorRate = user.VVI.maximumSensorRate : null;
      user.VVI.activityThreshold != undefined ? this.activityThreshold = user.VVI.activityThreshold : null;
      user.VVI.reactionTime != undefined ? this.reactionTime = user.VVI.reactionTime : null;
      user.VVI.recoveryTime != undefined ? this.recoveryTime = user.VVI.recoveryTime : null;
      user.VVI.responseFactor != undefined ? this.responseFactor = user.VVI.responseFactor : null;
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
