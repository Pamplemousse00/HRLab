<template>
  <div class="modal-card" style="width: 500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Your Profile</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Full Name">
        <b-input
          class="is-danger"
          type="text"
          v-model="user.fullName"
          placeholder="e.g. Edward Lodewijk Van Halen"
          required>
        </b-input>
      </b-field>

      <b-field label="Username">
        <b-input
          class="is-danger"
          type="text"
          v-model="user.username"
          placeholder="Username..."
          required>
        </b-input>
      </b-field>

      <b-field label="Password">
        <b-input
          class="is-danger"
          type="password"
          v-model="user.password"
          placeholder="Password..."
          required>
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="display: flex;justify-content: flex-end">
      <b-button class="button" type="button" v-on:click="$parent.close()">Close</b-button>
      <b-button class="button is-primary" type="button" v-on:click="saveUser">Save</b-button>
    </footer>
  </div>  
</template>

<script>
import AuthState from '@/store/auth'
import { getModule } from 'vuex-module-decorators'

export default {
  data() {
    return {
      user: {},
      authModule: undefined
    }
  },
  async mounted() {
    this.authModule = getModule(AuthState, this.$store);
    this.user = await this.authModule.getCurrentUser();
  },
  methods: {
    saveUser() {
      this.authModule.updateCurrentUser(this.user);
      this.$parent.close();
    }
  }
}
</script>