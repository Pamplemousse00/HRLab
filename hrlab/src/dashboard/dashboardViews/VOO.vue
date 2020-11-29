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
      user.VOO.lowerRateLimit != undefined ? this.lowerRateLimit = user.VOO.lowerRateLimit : null;
      user.VOO.upperRateLimit != undefined ? this.upperRateLimit = user.VOO.upperRateLimit : null;
      user.VOO.ventricularAmplitude != undefined ? this.ventricularAmplitude = user.VOO.ventricularAmplitude : null;
      user.VOO.ventricularPulseWidth != undefined ? this.ventricularPulseWidth = user.VOO.ventricularPulseWidth : null;
    },
    async saveData() {
      // get current user, edit it's properties for this specific mode
      var user = await this.authModule.getCurrentUser();
      user.VOO = {
        lowerRateLimit: this.lowerRateLimit,
        upperRateLimit: this.upperRateLimit,
        ventricularAmplitude: this.ventricularAmplitude,
        ventricularPulseWidth: this.ventricularPulseWidth,
      }
      // save to storage
      this.authModule.updateCurrentUser(user);
    }
  }
}

  
</script>
