<template>
  <div>
    <section class="section">
      <form ref="form">
        <b-field label="Lower Rate Limit (ppm)" type="is-danger">
          <b-input type="number" placeholder="Lower Rate Limit..." v-model="lowerRateLimit" min="30" max="175" step="1"></b-input>
        </b-field>
        <b-field label="Atrial Amplitude (V)" type="is-danger">
          <b-input type="number" placeholder="Atrial Amplitude..." v-model="atrialAmplitude" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="Atrial Pulse Width (ms)" type="is-danger">
          <b-input type="number" placeholder="Atrial Pulse Width..." v-model="atrialPulseWidth" min="1" max="30" step="1"></b-input>
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
        <button type="button" :disabled="!formValid" class="button is-danger is-fullwidth" v-on:click="saveData()">{{ (serialModule.currentMode == 0) ? "Save" : "Save & Send" }}</button>
      </form>
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
      formValid: true,

      lowerRateLimit: undefined,
      atrialAmplitude: undefined,
      atrialPulseWidth: undefined,
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
  created() {
    // [
    //   "lowerRateLimit",
    //   "atrialAmplitude",
    //   "atrialPulseWidth",
    //   "maximumSensorRate",
    //   "activityThreshold",
    //   "reactionTime",
    //   "recoveryTime",
    //   "responseFactor"
    // ].forEach(field => {
    //   this.$watch(field, () => {
    //     this.formValid = this.$refs.form.checkValidity();
    //   });
    // })
  },
  methods: {
    async getData() {
      // run on init, prefills textboxes with data from user's storage
      var user = await this.authModule.getCurrentUser();
      console.log(user);
      this.lowerRateLimit = (user.AOO.lowerRateLimit != undefined) ? user.AOO.lowerRateLimit : 100;
      this.atrialAmplitude = (user.AOO.atrialAmplitude != undefined) ? user.AOO.atrialAmplitude : 5;
      this.atrialPulseWidth = (user.AOO.atrialPulseWidth != undefined) ? user.AOO.atrialPulseWidth : 20;
      this.showRateAdaptation = (user.AOO.showRateAdaptation != undefined) ? user.AOO.showRateAdaptation : false;
      this.maximumSensorRate = (user.AOO.maximumSensorRate != undefined) ? user.AOO.maximumSensorRate : 100;
      this.activityThreshold = (user.AOO.activityThreshold != undefined) ? user.AOO.activityThreshold : 2;
      this.reactionTime = (user.AOO.reactionTime != undefined) ? user.AOO.reactionTime : 20;
      this.recoveryTime = (user.AOO.recoveryTime != undefined) ? user.AOO.recoveryTime : 3;
      this.responseFactor = (user.AOO.responseFactor != undefined) ? user.AOO.responseFactor : 1;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.AOO = {
        lowerRateLimit: this.lowerRateLimit,
        atrialAmplitude: this.atrialAmplitude,
        atrialPulseWidth: this.atrialPulseWidth,
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
        this.serialModule.startAOOR({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_atrial_width: parseInt(this.atrialPulseWidth),
          p_atrial_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1),
          p_MSR: parseInt(this.maximumSensorRate),
          p_acc_threshold: Math.round(parseFloat(this.activityThreshold) / 0.001),
          p_react_time: Math.round(parseFloat(this.reactionTime) / 10),
          p_recovery_time: parseInt(this.recoveryTime),
          p_response_factor: parseInt(this.responseFactor)
        });
      } else {
        this.serialModule.startAOO({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_atrial_width: parseInt(this.atrialPulseWidth),
          p_atrial_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1)
        });
      }
    }
  }
}

  
</script>
