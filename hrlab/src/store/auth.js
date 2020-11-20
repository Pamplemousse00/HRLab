import {
  Module, VuexModule, Mutation, Action,
} from 'vuex-module-decorators';

@Module({
  name: 'auth',
  namespaced: true,
})
export default class AuthState extends VuexModule {

  @Action  
  isLoggedIn() {
    // get the current user. If undefined, nobody is logged in
    var currentUserIndex = JSON.parse(window.localStorage.getItem('currentUserIndex'));
    if (currentUserIndex != null) {
      return true;
    } else {
      return false;
    }
  }

  @Action
  getCurrentUser() {
    if (isLoggedIn()) {
      var currentUser = JSON.parse(localStorage.getItem('users'))[JSON.parse(window.localStorage.getItem('currentUserIndex'))];
      return currentUser;
    } else {
      window.location.href = './login.html';
      return null;
    }
  }

  @Action
  updateCurrentUser(newUser) {
    var existingUsers = JSON.parse(window.localStorage.getItem('users'));
    existingUsers[JSON.parse(localStorage.getItem('currentUserIndex'))] = newUser;
    localStorage.setItem('users', JSON.stringify(existingUsers));
  }

  @Action
  register() {
    // registering a new user
    var newUser = {
      username: document.getElementById('registerUsername').value,
      password: document.getElementById('registerPassword').value,
      fullName: document.getElementById('registerFullName').value,
      AOO: {},
      VOO: {},
      AAI: {},
      VVI: {},
      VOOR: {},
      DDDR: {}
    }
    var existingUsers = JSON.parse(window.localStorage.getItem('users'));
  
    // first-time initialization of 'existingUsers'
    if (!existingUsers) {
      existingUsers = [];
    }
  
    if(existingUsers.length > 9) {
      alert('Number of supported users exceeded (10). Please clear local storage.');
      return;
    }
    // append new user to storage
    existingUsers.push(newUser);
    window.localStorage.setItem('users', JSON.stringify(existingUsers));
  
    // close modal and show success notification
    document.getElementById('registerModal').classList.remove('is-active');
    document.getElementById('notification').style.visibility = 'visible';
    setTimeout(function() {
      document.getElementById('notification').style.visibility = 'hidden';
    }, 2000);
  }

  @Action
  login() {
    // get all users
    var existingUsers = JSON.parse(window.localStorage.getItem('users'));
    var loginUser = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    }
    //loop through all users looking for a match
    existingUsers.forEach((user, index) => {
      if (user.username == loginUser.username) {
        if(user.password == loginUser.password) {
          // log user in and proceed to dashboard
          window.localStorage.setItem('currentUserIndex', JSON.stringify(index));
          this.window.location.href = './dashboard.html';
        }
      }
    });
  }

  @Action
  logout() {
    window.localStorage.setItem('currentUserIndex', JSON.stringify(null));
    window.location.href = './login.html';
  }

}
