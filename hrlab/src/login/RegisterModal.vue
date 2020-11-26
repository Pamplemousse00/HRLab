<template>
  <div class="modal-card" style="width: 500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Create an Account</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Full Name">
        <b-input
          class="is-danger"
          type="text"
          v-model="fullName"
          placeholder="e.g. Edward Lodewijk Van Halen"
          required>
        </b-input>
      </b-field>

      <b-field label="Username">
        <b-input
          class="is-danger"
          type="text"
          v-model="username"
          placeholder="Username..."
          required>
        </b-input>
      </b-field>

      <b-field label="Password">
        <b-input
          class="is-danger"
          type="password"
          v-model="password"
          placeholder="Password..."
          required>
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="display: flex;justify-content: flex-end">
      <b-button class="button" type="button" v-on:click="$parent.close()">Close</b-button>
      <b-button class="button is-primary" type="button" v-on:click="createUser">Submit</b-button>
    </footer>
  </div>  
</template>

<script>
import AuthState from '@/store/auth'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      fullName: '',
      username: '',
      password: '',
      authModule: undefined
    }
  },
  mounted() {
    this.authModule = getModule(AuthState, this.$store)
  },
  methods: {
    createUser() {
      if(this.authModule.register({ username: this.username, password: this.password, fullName: this.fullName })) {
        this.$parent.close()
      }
    }
  }
}
</script>