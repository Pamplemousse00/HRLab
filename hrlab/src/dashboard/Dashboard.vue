<template>
  <div>
    <Navbar />
  <body>
  <section class="section">
    <div class="container" style="width: 50%;">
      <b-tabs type="is-boxed is-danger" size="is-medium">
        <b-tab-item label="AOO"><AOO></AOO></b-tab-item>
        <b-tab-item label="VOO"><VOO></VOO></b-tab-item>
        <b-tab-item label="AAI"><AAI></AAI></b-tab-item>
        <b-tab-item label="VVI"><VVI></VVI></b-tab-item>
        <b-tab-item label="DOO"><DOO></DOO></b-tab-item>
      </b-tabs>
    </div>
    <div style="width: 50%; height: 800px; display: inline;">
      <canvas id="rateChart"></canvas>
    </div>
  </section>
  <div class="modal" id="aboutModal">
    <div class="modal-background" onclick="closeAboutModal()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">About This Software</p>
        <button class="delete" aria-label="close" onclick="closeAboutModal()"></button>
      </header>
      <section class="modal-card-body">
        Version: Alpha V0.1<br>
        Revision: 1<br>
        DCM Serial Number: XXXXXX<br>
        Institution Name: McMaster University
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" onclick="closeAboutModal()">Return</button>
      </footer>
    </div>
  </div>
  <div class="modal" id="profileModal">
    <div class="modal-background" onclick="closeProfileModal()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">My Profile</p>
        <button class="delete" aria-label="close" onclick="closeProfileModal()"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Full Name</label>
          <input class="input is-danger" type="text" placeholder="Full Name..." id="profileFullName">
        </div>
        <div class="field">
          <label class="label">Username</label>
          <input class="input is-danger" type="text" placeholder="Username..." id="profileUsername">
        </div>
        <div class="field">
          <label class="label">Password</label>
          <input class="input is-danger" type="password" placeholder="Password..." id="profilePassword">
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-danger" onclick="saveProfile()">Save</button>
        <button class="button" onclick="closeProfileModal()">Cancel</button>
      </footer>
    </div>
  </div>
  <div class="modal" id="deviceModal">
    <div class="modal-background" onclick="closeDeviceModal()"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Device Connection</p>
        <button class="delete" aria-label="close" onclick="closeDeviceModal()"></button>
      </header>
      <section class="modal-card-body">
        <button class="button is-danger" style="width: 100%" onclick="openPort()">Connect</button>
        <div class="field">
          <label class="label">
            Device:
          </label>
        </div>
        <div class="field">
          <label class="label">
            Last Connected Device: None
          </label>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-danger" onclick="saveProfile()">Save</button>
        <button class="button" onclick="closeDeviceModal()">Cancel</button>
      </footer>
    </div>
  </div>
  </body>
  </div>
</template>

<script>
import AAI from '@/dashboard/dashboardViews/AAI'
import AOO from '@/dashboard/dashboardViews/AOO'
import DOO from '@/dashboard/dashboardViews/DOO'
import VOO from '@/dashboard/dashboardViews/VOO'
import VVI from '@/dashboard/dashboardViews/VVI'
import Navbar from '@/dashboard/Navbar'
export default {
  data() {
    return {
      selectedMode: 3,
    }
  },
  methods: {
    selectMode(mode) {
      console.log(mode);
      this.selectedMode = mode;
    }
  },
  components: {
    Navbar,
    AAI,
    AOO,
    DOO,
    VOO,
    VVI
  }
}
</script>
