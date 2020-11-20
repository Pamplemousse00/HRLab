<template>
  <div class="modal-card" style="width: 500px">
    <header class="modal-card-head">
      <p class="modal-card-title">Create an Account</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Full Name">
        <b-input
          type="text"
          v-model="fullName"
          placeholder="e.g. Edward Lodewijk Van Halen"
          required>
        </b-input>
      </b-field>

      <b-field label="Username">
        <b-input
          type="text"
          v-model="username"
          placeholder="Username..."
          required>
        </b-input>
      </b-field>

      <b-field label="Password">
        <b-input
          type="password"
          v-model="password"
          placeholder="Password..."
          required>
        </b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="display: flex;justify-content: flex-end">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" type="button" @click="createUser">Submit</button>
    </footer>
  </div>  
</template>

<script>
export default {
  data() {
    return {
      fullName: '',
      username: '',
      password: ''
    }
  },
  method: {
    createUser() {

    }
  }
}
</script>