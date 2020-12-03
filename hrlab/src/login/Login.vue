<template>
  <div>
    <body class="has-background-dark">
    <section class="section">
      <div style="justify-content: center; display: flex;">
        <img src="./logo.png" style="height: 300px"/>
      </div>
      <div class="container" style="max-width: 800px;">
        <h1 style="font-size: 40px; text-align: center;" class="has-text-white">Welcome to HRLab</h1>
        <b-field label="Username" type="is-primary">
          <b-input type="text" placeholder="Username..." v-model="username"></b-input>
        </b-field>
        <b-field label="Username" type="is-primary">
          <b-input type="text" placeholder="Password..." v-model="password"></b-input>
        </b-field>
        <b-button type="is-primary" expanded v-on:click="login()">Login</b-button>
        <div class="has-text-white">Don't have an account? Register <a v-on:click="registerModalShown = true" style="color: hsl(348, 100%, 61%);">here.</a></div>
      </div>
    </section>
    <div style="justify-content: center; display: flex; visibility: hidden;" id="notification">
      <div class="modal-background" v-on:click="closeNotification()"></div>
      <div class="notification is-primary" style="max-width: 400px; position: absolute; top: 45%;" >
        <button class="delete" v-on:click="closeNotification()"></button>
        Successfully registered! Please proceed to log in.
      </div>
    </div>
    </body>

    <b-modal :active.sync="registerModalShown" has-modal-card>
      <RegisterModal></RegisterModal>
    </b-modal>
  </div>
</template>

<script>
import RegisterModal from '@/login/RegisterModal'
import AuthState from '@/store/auth'
import { getModule } from 'vuex-module-decorators'

export default {
  data(){
    return {
      username: '',
      password: '',
      registerModalShown: false,
      authModule: undefined
    }
  },
  mounted() {
    this.authModule = getModule(AuthState, this.$store)
  },
  methods: {
    async login() {
      if(this.authModule.login({ username: this.username, password: this.password })) {
        this.$router.push('/dashboard')
        // this.$buefy.toast.open({ message: "Welcome to HRLab.", position: "is-top", type: "is-success" });
      } else {
        alert('user not found')
      }
    }
  },
  components: {
    RegisterModal
  }
}
</script>
