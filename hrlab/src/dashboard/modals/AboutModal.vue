<template>
  <div class="modal-card" style="width: 500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Your Profile</p>
    </header>
    <section class="modal-card-body">
        Version: Beta V0.3<br>
        Revision: 1<br>
        DCM Serial Number: XXXXXX<br>
        Institution Name: McMaster University
    </section>
    <footer class="modal-card-foot" style="display: flex;justify-content: flex-end">
      <b-button class="button" type="button" v-on:click="$parent.close()">Close</b-button>
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