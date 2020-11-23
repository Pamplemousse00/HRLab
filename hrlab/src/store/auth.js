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

  @Action({ rawError: true })
  register(username, password, fullName) {
    // registering a new user
    var newUser = {
      username: username,
      password: password,
      fullName: fullName,
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

    return true
  }

  @Action({ rawError: true })
  login(username, password) {
    // get all users
    var existingUsers = JSON.parse(window.localStorage.getItem('users'));
    var loginUser = {
      username: username,
      password: password
    }
    //loop through all users looking for a match
    existingUsers.forEach((user, index) => {
      if (user.username == loginUser.username) {
        if(user.password == loginUser.password) {
          // log user in and proceed to dashboard
          window.localStorage.setItem('currentUserIndex', JSON.stringify(index));
          return true
        }
      }
    });
    return false
  }

  @Action
  logout() {
    window.localStorage.setItem('currentUserIndex', JSON.stringify(null));
    window.location.href = './login.html';
  }

}
