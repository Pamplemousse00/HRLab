<template>
  <div>
    <b-navbar class="is-dark">
      <template slot="brand">
        <b-navbar-item>
          <img src="./logoSmall.png" height="28">
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item v-on:click="showPortModal = true">
          <div v-if="connectedDevice == undefined" style="color: #ff3860">Not Connected To Device</div>
          <div v-else style="color: #48c774">Connected to {{ connectedDevice }}</div>
        </b-navbar-item>
        <b-navbar-item v-on:click="showProfileModal = true">
          {{ user.fullName }}
        </b-navbar-item>
        <b-navbar-item v-on:click="showAboutModal = true">
          About
        </b-navbar-item>
        <b-navbar-item v-on:click="logout()">
          Log out
        </b-navbar-item>
      </template>
    </b-navbar>
    <b-modal :active.sync="showProfileModal" has-modal-card>
      <ProfileModal></ProfileModal>
    </b-modal>
    <b-modal :active.sync="showPortModal" has-modal-card>
      <PortModal></PortModal>
    </b-modal>
    <b-modal :active.sync="showAboutModal" has-modal-card>
      <AboutModal></AboutModal>
    </b-modal>
  </div>
</template>

<script>
import ProfileModal from '@/dashboard/modals/ProfileModal'
import PortModal from '@/dashboard/modals/PortModal'
import AboutModal from '@/dashboard/modals/AboutModal'
import AuthState from '@/store/auth'
import SerialState from '@/store/serial'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      showPortModal: false,
      showAboutModal: false,
      showProfileModal: false,
      authModule: undefined,
      serialModule: undefined,
      user: {},
      connectedDevice: undefined
    }
  },
  async mounted() {
    this.authModule = getModule(AuthState, this.$store);
    this.serialModule = getModule(SerialState, this.$store);
    this.connectedDevice = await this.serialModule.getConnectedDevice();
    this.user = await this.authModule.getCurrentUser();
  },
  methods: {
    logout() {
      this.authModule.logout();
      this.$router.push('/');
    }
  },
  components: {
    ProfileModal,
    PortModal,
    AboutModal
  }
}
</script>

