<template>
  <div>
    <section class="section">
        <b-field label="Pulse Rate (ppm)" type="is-danger">
          <b-input type="number" placeholder="Pulse Rate..." v-model="pulseRate" min="30" max="175" step="1"></b-input>
        </b-field>
        <b-field label="Ventricular Amplitude (V)" type="is-danger">
          <b-input type="number" placeholder="Ventricular Amplitude..." v-model="ventricularAmplitude" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="Ventricular Pulse Width (ms)" type="is-danger">
          <b-input type="number" placeholder="Ventricular Pulse Width..." v-model="ventricularPulseWidth" min="1" max="30" step="1"></b-input>
        </b-field>
        <b-field label="Atrial Amplitude (V)" type="is-danger">
          <b-input type="number" placeholder="Atrial Amplitude..." v-model="atrialAmplitude" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="Atrial Pulse Width (ms)" type="is-danger">
          <b-input type="number" placeholder="Atrial Pulse Width..." v-model="atrialPulseWidth" min="1" max="30" step="1"></b-input>
        </b-field>
        <b-field label="AV Delay (ms)" type="is-danger">
          <b-input type="number" placeholder="AV Delay..." v-model="AVDelay" min="20" max="300" step="1"></b-input>
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

      pulseRate: undefined,
      ventricularAmplitude: undefined,
      ventricularPulseWidth: undefined,
      atrialAmplitude: undefined,
      atrialPulseWidth: undefined,
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
    this.serialModule = getModule(SerialState, this.$store);
    this.getData();
  },
  methods: {
    async getData() {
      // run on init, prefills textboxes with data from user's storage
      var user = await this.authModule.getCurrentUser();
      console.log(user);
      this.pulseRate = (user.DOO.pulseRate != undefined) ? user.DOO.pulseRate : 100;
      this.atrialAmplitude = (user.DOO.atrialAmplitude != undefined) ? user.DOO.atrialAmplitude : 5;
      this.atrialPulseWidth = (user.DOO.atrialPulseWidth != undefined) ? user.DOO.atrialPulseWidth : 20;
      this.ventricularAmplitude = (user.DOO.ventricularAmplitude != undefined) ? user.DOO.ventricularAmplitude : 5;
      this.ventricularPulseWidth = (user.DOO.ventricularPulseWidth != undefined) ? user.DOO.ventricularPulseWidth : 20;
      this.AVDelay = (user.DOO.AVDelay != undefined) ? user.DOO.AVDelay : 100;
      this.showRateAdaptation = (user.DOO.showRateAdaptation != undefined) ? user.DOO.showRateAdaptation : false;
      this.maximumSensorRate = (user.DOO.maximumSensorRate != undefined) ? user.DOO.maximumSensorRate : 100;
      this.activityThreshold = (user.DOO.activityThreshold != undefined) ? user.DOO.activityThreshold : 2;
      this.reactionTime = (user.DOO.reactionTime != undefined) ? user.DOO.reactionTime : 20;
      this.recoveryTime = (user.DOO.recoveryTime != undefined) ? user.DOO.recoveryTime : 3;
      this.responseFactor = (user.DOO.responseFactor != undefined) ? user.DOO.responseFactor : 1;
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
        showRateAdaptation: this.showRateAdaptation,
        maximumSensorRate: this.maximumSensorRate,
        activityThreshold: this.activityThreshold,
        reactionTime: this.reactionTime,
        recoveryTime: this.recoveryTime,
        responseFactor: this.responseFactor
      }
      // save to storage
      this.authModule.updateCurrentUser(user);

      if(this.showRateAdaptation) {
        this.serialModule.startDOOR({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1),
          p_vent_width: parseInt(this.atrialPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1),
          p_AV_delay: parseInt(this.AVDelay),
          p_MSR: parseInt(this.maximumSensorRate),
          p_acc_threshold: Math.round(parseFloat(this.activityThreshold) / 0.001),
          p_react_time: Math.round(parseFloat(this.reactionTime) / 10),
          p_recovery_time: parseInt(this.recoveryTime),
          p_response_factor: parseInt(this.responseFactor)
        });
      } else {
        this.serialModule.startDOO({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1),
          p_vent_width: parseInt(this.atrialPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1),
          p_AV_delay: parseInt(this.AVDelay)
        });
      }
    }
  }
}

  
</script>
