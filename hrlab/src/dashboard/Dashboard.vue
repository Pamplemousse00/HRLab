<template>
  <div>
  <body>
  <section class="section">
    <div class="container">
      <div class="tabs is-medium is-boxed">
        <ul>
          <li onclick="setMode('AOO')" id="AOO" class="is-active"><a style="color: hsl(348, 100%, 61%)">AOO</a></li>
          <li onclick="setMode('VOO')" id="VOO"><a>VOO</a></li>
          <li onclick="setMode('AAI')" id="AAI"><a>AAI</a></li>
          <li onclick="setMode('VVI')" id="VVI"><a>VVI</a></li>
          <li onclick="setMode('VOOR')" id="VOOR"><a>VOOR</a></li>
          <li onclick="setMode('DDDR')" id="DDDR"><a>DDDR</a></li>
        </ul>
      </div>
      <div style="width: 50%; height: 800px; display: inline-block;">
        <canvas id="rateChart"></canvas>
      </div>
      <div style="display: inline-block; width: 49%;">
        <iframe src="./dashboardViews/AOO.html" seamless style="height: 800px; width: 100%;" scrolling="no" id="AOOFrame"></iframe>
        <iframe src="./dashboardViews/VOO.html" seamless style="height: 800px; width: 100%;" scrolling="no" id="VOOFrame" hidden></iframe>
        <iframe src="./dashboardViews/AAI.html" seamless style="height: 800px; width: 100%;" scrolling="no" id="AAIFrame" hidden></iframe>
        <iframe src="./dashboardViews/VVI.html" seamless style="height: 800px; width: 100%;" scrolling="no" id="VVIFrame" hidden></iframe>
        <iframe src="./dashboardViews/VOOR.html" seamless style="height: 800px; width: 100%;" scrolling="no" id="VOORFrame" hidden></iframe>
        <iframe src="./dashboardViews/DDDR.html" seamless style="height: 800px; width: 100%;" scrolling="no" id="DDDRFrame" hidden></iframe>
      </div>
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
  <Navbar />
  </div>
</template>

<script>
import Navbar from '@/dashboard/Navbar'
export default {
  data() {
    return {

    }
  },
  methods: {

  },
  components: {
    Navbar
  }
}
</script>
