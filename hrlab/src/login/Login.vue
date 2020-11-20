<template>
  <div>
    <body class="has-background-dark">
    <section class="section">
      <div style="justify-content: center; display: flex;">
        <img src="./logo.png" style="height: 300px"/>
      </div>
      <div class="container" style="max-width: 800px;">
        <h1>Welcome to HRLab</h1>
        <b-field label="Username" type="is-danger">
          <b-input type="text" placeholder="Username..." v-model="username"></b-input>
        </b-field>
        <b-field label="Username" type="is-danger">
          <b-input type="text" placeholder="Password..." v-model="password"></b-input>
        </b-field>
        <b-button type="is-danger" expanded>Login</b-button>
        Don't have an account? Register <a @click="openRegisterModal()">here.</a>
      </div>
    </section>
    <div class="modal" id="registerModal">
      <div class="modal-background" @click="closeRegisterModal()"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create an Account</p>
          <button class="delete" aria-label="close" @click="closeRegisterModal()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Full name</label>
            <input class="input is-danger" type="text" placeholder="e.g. Edward Lodewijk Van Halen" id="registerFullName">
          </div>
          <div class="field">
            <label class="label">Username</label>
            <input class="input is-danger" type="text" placeholder="Username..." id="registerUsername">
          </div>
          <div class="field">
            <label class="label">Password</label>
            <input class="input is-danger" type="password" placeholder="Password..." id="registerPassword">
          </div>
          Please do not reuse a password from another site. We store the password as a string.
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" @click="register()">Register</button>
          <button class="button" @click="closeRegisterModal()">Cancel</button>
        </footer>
      </div>
    </div>
    <div style="justify-content: center; display: flex; visibility: hidden;" id="notification">
      <div class="modal-background" @click="closeNotification()"></div>
      <div class="notification is-danger" style="max-width: 400px; position: absolute; top: 45%;" >
        <button class="delete" @click="closeNotification()"></button>
        Successfully registered! Please proceed to log in.
      </div>
    </div>
    </body>
  </div>
</template>

<script>
export default {
  data(){
    return {
      username: '',
      password: '',
      registerModalShown: false,

    }
  },
  mounted() {
  // 'enter' keypress on password text field
    document.getElementById("password").addEventListener("keyup", event => {
      if(event.key !== "Enter") return;
      this.login();
      event.preventDefault();
    });
  },
  methods: {
    closeNotification() {
      document.getElementById('notification').style.visibility = 'hidden';
    },
    openRegisterModal() {
      document.getElementById('registerModal').classList.add('is-active');
    },
    closeRegisterModal() {
      document.getElementById('registerModal').classList.remove('is-active');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
