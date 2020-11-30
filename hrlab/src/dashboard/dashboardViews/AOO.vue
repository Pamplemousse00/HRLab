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
          <b-input type="number" placeholder="Atrial Amplitude..." v-model="atrialAmplitude" min="0.5" max="5" step="0.1"></b-input>
        </b-field>
        <b-field label="Atrial Pulse Width" type="is-danger">
          <b-input type="number" placeholder="Atrial Pulse Width..." v-model="atrialPulseWidth" min="0.5" max="5" step="0.1"></b-input>
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
    this.getData();
  },
  methods: {
    async getData() {
      // run on init, prefills textboxes with data from user's storage
      var user = await this.authModule.getCurrentUser();
      console.log(user);
      user.AOO.lowerRateLimit != undefined ? this.lowerRateLimit = user.AOO.lowerRateLimit : null;
      user.AOO.upperRateLimit != undefined ? this.upperRateLimit = user.AOO.upperRateLimit : null;
      user.AOO.atrialAmplitude != undefined ? this.atrialAmplitude = user.AOO.atrialAmplitude : null;
      user.AOO.atrialPulseWidth != undefined ? this.atrialPulseWidth = user.AOO.atrialPulseWidth : null;
      user.AOO.showRateAdaptation != undefined ? this.showRateAdaptation = user.AOO.showRateAdaptation : null;
      user.AOO.maximumSensorRate != undefined ? this.maximumSensorRate = user.AOO.maximumSensorRate : null;
      user.AOO.activityThreshold != undefined ? this.activityThreshold = user.AOO.activityThreshold : null;
      user.AOO.reactionTime != undefined ? this.reactionTime = user.AOO.reactionTime : null;
      user.AOO.recoveryTime != undefined ? this.recoveryTime = user.AOO.recoveryTime : null;
      user.AOO.responseFactor != undefined ? this.responseFactor = user.AOO.responseFactor : null;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.AOO = {
        lowerRateLimit: this.lowerRateLimit,
        upperRateLimit: this.upperRateLimit,
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
    }
  }
}

  
</script>
