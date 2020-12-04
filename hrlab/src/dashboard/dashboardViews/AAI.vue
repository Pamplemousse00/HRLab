<template>
  <div>
    <section class="section">
        <b-field label="Lower Rate Limit (ppm)" type="is-danger">
          <b-input type="number" placeholder="Lower Rate Limit..." v-model="lowerRateLimit" min="30" max="175" step="1"></b-input>
        </b-field>
        <b-field label="Atrial Amplitude (V)" type="is-danger">
          <b-input type="number" placeholder="Atrial Amplitude..." v-model="atrialAmplitude" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="Atrial Pulse Width (ms)" type="is-danger">
          <b-input type="number" placeholder="Atrial Pulse Width..." v-model="atrialPulseWidth" min="1" max="30" step="1"></b-input>
        </b-field>
        <b-field label="Atrial Sensitivity (V)" type="is-danger">
          <b-input type="number" placeholder="Atrial Sensitivity..." v-model="atrialSensitivity" min="0" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="ARP (ms)" type="is-danger">
          <b-input type="number" placeholder="ARP..." v-model="arp" min="150" max="500" step="1"></b-input>
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
      atrialAmplitude: undefined,
      atrialPulseWidth: undefined,
      atrialSensitivity: undefined,
      arp: undefined,
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
      this.lowerRateLimit = (user.AAI.lowerRateLimit != undefined) ? user.AAI.lowerRateLimit : 30;
      this.atrialAmplitude = (user.AAI.atrialAmplitude != undefined) ? user.AAI.atrialAmplitude : 5;
      this.atrialPulseWidth = (user.AAI.atrialPulseWidth != undefined) ? user.AAI.atrialPulseWidth : 10;
      this.atrialSensitivity = (user.AAI.atrialSensitivity != undefined) ? user.AAI.atrialSensitivity : 3;
      this.arp = (user.AAI.arp != undefined) ? user.AAI.arp : 200;
      this.showHysteresisField = (user.AAI.showHysteresisField != undefined) ? user.AAI.showHysteresisField : false;
      this.hysteresisPacingRate = (user.AAI.hysteresisPacingRate != undefined) ? user.AAI.hysteresisPacingRate : 100;
      this.showRateAdaptation = (user.AAI.showRateAdaptation != undefined) ? user.AAI.showRateAdaptation : false;
      this.maximumSensorRate = (user.AAI.maximumSensorRate != undefined) ? user.AAI.maximumSensorRate : 100;
      this.activityThreshold = (user.AAI.activityThreshold != undefined) ? user.AAI.activityThreshold : 2;
      this.reactionTime = (user.AAI.reactionTime != undefined) ? user.AAI.reactionTime : 20;
      this.recoveryTime = (user.AAI.recoveryTime != undefined) ? user.AAI.recoveryTime : 3;
      this.responseFactor = (user.AAI.responseFactor != undefined) ? user.AAI.responseFactor : 1;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.AAI = {
        lowerRateLimit: this.lowerRateLimit,
        atrialAmplitude: this.atrialAmplitude,
        atrialPulseWidth: this.atrialPulseWidth,
        atrialSensitivity: this.atrialSensitivity,
        arp: this.arp,
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
        this.serialModule.startAAIHR({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_atrial_width: parseInt(this.atrialPulseWidth),
          p_atrial_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1),
          p_atrial_sensitivity: Math.round(parseFloat(this.atrialSensitivity) / 0.1),
          p_ARP: parseInt(this.arp),
          p_hysteresis_rate: parseInt(this.hysteresisPacingRate),
          p_MSR: parseInt(this.maximumSensorRate),
          p_acc_threshold: Math.round(parseFloat(this.activityThreshold) / 0.001),
          p_react_time: Math.round(parseFloat(this.reactionTime) / 10),
          p_recovery_time: parseInt(this.recoveryTime),
          p_response_factor: parseInt(this.responseFactor),
        });
      } else if(this.showHysteresisField && !this.showRateAdaptation) {
        this.serialModule.startAAIH({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_atrial_width: parseInt(this.atrialPulseWidth),
          p_atrial_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1),
          p_atrial_sensitivity: Math.round(parseFloat(this.atrialSensitivity) / 0.1),
          p_ARP: parseInt(this.arp),
          p_hysteresis_rate: parseInt(this.hysteresisPacingRate),
        });
      } else if(!this.showHysteresisField && this.showRateAdaptation) {
        this.serialModule.startAAIR({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_atrial_width: parseInt(this.atrialPulseWidth),
          p_atrial_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1),
          p_atrial_sensitivity: Math.round(parseFloat(this.atrialSensitivity) / 0.1),
          p_ARP: parseInt(this.arp),
          p_MSR: parseInt(this.maximumSensorRate),
          p_acc_threshold: Math.round(parseFloat(this.activityThreshold) / 0.001),
          p_react_time: Math.round(parseFloat(this.reactionTime) / 10),
          p_recovery_time: parseInt(this.recoveryTime),
          p_response_factor: parseInt(this.responseFactor),
        });
      } else {
        this.serialModule.startAAI({
          p_pulse_rate: parseInt(this.lowerRateLimit),
          p_atrial_width: parseInt(this.atrialPulseWidth),
          p_atrial_amplitude: Math.round(parseFloat(this.atrialAmplitude) / 0.1),
          p_atrial_sensitivity: Math.round(parseFloat(this.atrialSensitivity) / 0.1),
          p_ARP: parseInt(this.arp),
        });
      } 
    }
  }
}

  
</script>
