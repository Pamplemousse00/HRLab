<template>
  <div>
    <section class="section">
        <b-field label="Lower Rate Limit (ppm)" type="is-danger">
          <b-input type="number" placeholder="Lower Rate Limit..." v-model="lowerRateLimit" min="30" max="175" step="1"></b-input>
        </b-field>
        <b-field label="Ventricular Amplitude (V)" type="is-danger">
          <b-input type="number" placeholder="Ventricular Amplitude..." v-model="ventricularAmplitude" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="Ventricular Pulse Width (ms)" type="is-danger">
          <b-input type="number" placeholder="Ventricular Pulse Width..." v-model="ventricularPulseWidth" min="1" max="30" step="1"></b-input>
        </b-field>
        <b-field label="Ventricular Sensitivity (V)" type="is-danger">
          <b-input type="number" placeholder="Ventricular Sensitivity..." v-model="ventricularSensitivity" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="VRP (ms)" type="is-danger">
          <b-input type="number" placeholder="VRP..." v-model="vrp" min="150" max="500" step="1"></b-input>
        </b-field>
        <div class="field">
          <b-checkbox v-model="showHysteresisField" type="is-danger">
            Hysteresis Pacing
          </b-checkbox>
        </div>
        <b-field label="Hysteresis Pacing Rate (ppm)" v-if="showHysteresisField" type="is-danger">
          <b-input type="number" placeholder="Hysteresis Pacing Rate..." v-model="hysteresisPacingRate" min="30" max="175" step="1"></b-input>
        </b-field>
        <div class="field">
          <b-checkbox v-model="showRateAdaptation" type="is-danger">
            Rate Adaptation
          </b-checkbox>
        </div>
        <div v-if="showRateAdaptation" style="margin-bottom: 20px;">
          <b-field label="Maximum Sensor Rate (ppm)" type="is-danger">
            <b-input type="number" placeholder="Maximum Sensor Rate..." v-model="maximumSensorRate" min="50" max="175" step="1"></b-input>
          </b-field>
          <b-field label="Activity Threshold (g)" type="is-danger">
            <b-input type="number" placeholder="Activity Threshold..." v-model="activityThreshold" min="1" max="4" step="0.001"></b-input>
          </b-field>
          <b-field label="Reaction Time (s)" type="is-danger">
            <b-input type="number" placeholder="Reaction Time..." v-model="reactionTime" min="10" max="50" step="10"></b-input>
          </b-field>
          <b-field label="Recovery Time (min)" type="is-danger">
            <b-input type="number" placeholder="Recovery Time..." v-model="recoveryTime" min="2" max="16" step="1"></b-input>
          </b-field>
          <b-field label="Response Factor" type="is-danger">
            <b-input type="number" placeholder="Response Factor..." v-model="responseFactor" min="1" max="16" step="1"></b-input>
          </b-field>
        </div>
        <button class="button is-danger is-fullwidth" v-on:click="saveData()">{{ (serialModule.currentMode == 0) ? "Save" : "Save & Send" }}</button>
    </section>
  </div>
</template>

<script>

import AuthState from '@/store/auth'
import SerialState from '@/store/serial'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      authModule: undefined,
      serialModule: {},

      showHysteresisField: false,
      lowerRateLimit: undefined,
      ventricularAmplitude: undefined,
      ventricularPulseWidth: undefined,
      ventricularSensitivity: undefined,
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
    this.serialModule = getModule(SerialState, this.$store);
    this.getData();
  },
  methods: {
    async getData() {
      // run on init, prefills textboxes with data from user's storage
      var user = await this.authModule.getCurrentUser();
      console.log(user);
      this.lowerRateLimit = (user.VVI.lowerRateLimit != undefined) ? user.VVI.lowerRateLimit : 30;
      this.ventricularAmplitude = (user.VVI.ventricularAmplitude != undefined) ? user.VVI.ventricularAmplitude : 5;
      this.ventricularPulseWidth = (user.VVI.ventricularPulseWidth != undefined) ? user.VVI.ventricularPulseWidth : 10;
      this.ventricularSensitivity = (user.VVI.ventricularSensitivity != undefined) ? user.VVI.ventricularPulseWidth : 3;
      this.vrp = (user.VVI.vrp != undefined) ? user.VVI.vrp : 200;
      this.showHysteresisField = (user.VVI.showHysteresisField != undefined) ? user.VVI.showHysteresisField : false;
      this.hysteresisPacingRate = (user.VVI.hysteresisPacingRate != undefined) ? user.VVI.hysteresisPacingRate : 100;
      this.showRateAdaptation = (user.VVI.showRateAdaptation != undefined) ? user.VVI.showRateAdaptation : false;
      this.maximumSensorRate = (user.VVI.maximumSensorRate != undefined) ? user.VVI.maximumSensorRate : 100;
      this.activityThreshold = (user.VVI.activityThreshold != undefined) ? user.VVI.activityThreshold : 2;
      this.reactionTime = (user.VVI.reactionTime != undefined) ? user.VVI.reactionTime : 20;
      this.recoveryTime = (user.VVI.recoveryTime != undefined) ? user.VVI.recoveryTime : 3;
      this.responseFactor = (user.VVI.responseFactor != undefined) ? user.VVI.responseFactor : 1;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.VVI = {
        lowerRateLimit: this.lowerRateLimit,
        upperRateLimit: this.upperRateLimit,
        ventricularAmplitude: this.ventricularAmplitude,
        ventricularPulseWidth: this.ventricularPulseWidth,
        ventricularSensitivity: this.ventricularSensitivity,
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

      if(this.showHysteresisField && this.showRateAdaptation) {
        this.serialModule.startVVIHR({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1),
          p_vent_sensitivity: Math.round(parseFloat(this.ventricularSensitivity) / 0.1),
          p_VRP: parseInt(this.vrp),
          p_hysteresis_rate: parseInt(this.hysteresisPacingRate),
          p_MSR: parseInt(this.maximumSensorRate),
          p_acc_threshold: Math.round(parseFloat(this.activityThreshold) / 0.001),
          p_react_time: Math.round(parseFloat(this.reactionTime) / 10),
          p_recovery_time: parseInt(this.recoveryTime),
          p_response_factor: parseInt(this.responseFactor),
        });
      } else if(this.showHysteresisField && !this.showRateAdaptation) {
        this.serialModule.startVVIH({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1),
          p_vent_sensitivity: Math.round(parseFloat(this.ventricularSensitivity) / 0.1),
          p_VRP: parseInt(this.vrp),
          p_hysteresis_rate: parseInt(this.hysteresisPacingRate),
        });
      } else if(!this.showHysteresisField && this.showRateAdaptation) {
        this.serialModule.startVVIR({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1),
          p_vent_sensitivity: Math.round(parseFloat(this.ventricularSensitivity) / 0.1),
          p_VRP: parseInt(this.vrp),
          p_MSR: parseInt(this.maximumSensorRate),
          p_acc_threshold: Math.round(parseFloat(this.activityThreshold) / 0.001),
          p_react_time: Math.round(parseFloat(this.reactionTime) / 10),
          p_recovery_time: parseInt(this.recoveryTime),
          p_response_factor: parseInt(this.responseFactor),
        });
      } else {
        this.serialModule.startVVI({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1),
          p_vent_sensitivity: Math.round(parseFloat(this.ventricularSensitivity) / 0.1),
          p_VRP: parseInt(this.vrp),
        });
      }
    }
  }
}

  
</script>
