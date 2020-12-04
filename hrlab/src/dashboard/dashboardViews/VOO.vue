<template>
  <div>
    <section class="section">
        <b-field label="Lower Rate Limit (ppm)" type="is-danger">
          <b-input type="number" placeholder="Lower Rate Limit..." v-model="lowerRateLimit" min="30" max="175"></b-input>
        </b-field>
        <b-field label="Ventricular Amplitude (V)" type="is-danger">
          <b-input type="number" placeholder="Ventricular Amplitude..." v-model="ventricularAmplitude" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="Ventricular Pulse Width (ms)" type="is-danger">
          <b-input type="number" placeholder="Ventricular Pulse Width..." v-model="ventricularPulseWidth" min="1" max="30" step="1"></b-input>
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
      
      lowerRateLimit: undefined,
      ventricularAmplitude: undefined,
      ventricularPulseWidth: undefined,
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
      this.lowerRateLimit = (user.VOO.lowerRateLimit != undefined) ? user.VOO.lowerRateLimit : 100;
      this.ventricularAmplitude = (user.VOO.ventricularAmplitude != undefined) ? user.VOO.ventricularAmplitude : 5;
      this.ventricularPulseWidth = (user.VOO.ventricularPulseWidth != undefined) ? user.VOO.ventricularPulseWidth : 20;
      this.showRateAdaptation = (user.VOO.showRateAdaptation != undefined) ? user.VOO.showRateAdaptation : false;
      this.maximumSensorRate = (user.VOO.maximumSensorRate != undefined) ? user.VOO.maximumSensorRate : 100;
      this.activityThreshold = (user.VOO.activityThreshold != undefined) ? user.VOO.activityThreshold : 2;
      this.reactionTime = (user.VOO.reactionTime != undefined) ? user.VOO.reactionTime : 20;
      this.recoveryTime = (user.VOO.recoveryTime != undefined) ? user.VOO.recoveryTime : 3;
      this.responseFactor = (user.VOO.responseFactor != undefined) ? user.VOO.responseFactor : 1;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.VOO = {
        lowerRateLimit: this.lowerRateLimit,
        ventricularAmplitude: this.ventricularAmplitude,
        ventricularPulseWidth: this.ventricularPulseWidth,
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
        this.serialModule.startVOOR({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1),
          p_MSR: parseInt(this.maximumSensorRate),
          p_acc_threshold: Math.round(parseFloat(this.activityThreshold) / 0.001),
          p_react_time: Math.round(parseFloat(this.reactionTime) / 10),
          p_recovery_time: parseInt(this.recoveryTime),
          p_response_factor: parseInt(this.responseFactor)
        });
      } else {
        this.serialModule.startVOO({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_vent_width: parseInt(this.ventricularPulseWidth),
          p_vent_amplitude: Math.round(parseFloat(this.ventricularAmplitude) / 0.1)
        });
      }
    }
  }
}

  
</script>
