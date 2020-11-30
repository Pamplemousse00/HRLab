import {
  Module, VuexModule, Mutation, Action,
} from 'vuex-module-decorators';

@Module({
  name: 'auth',
  namespaced: true,
})
export default class AuthState extends VuexModule {

  path = require('path')
  
  @Action
  getFS() {
    const fs = require('fs');
    return fs;
  }

  @Action({ rawError: true })
  async getItem(itemName) {
    let returnData = {};
    await this.getFS().readFile(`${this.path}/HRLabData/auth.txt`, 'utf8' , (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
      jsonData = JSON.parse(data);
      returnData = jsonData[itemName];
    });
    return returnData;
  }

  @Action({ rawError: true })
  async setItem(itemName, item) {
    await fs.readFile(`${this.path}/HRLabData/auth.txt`, 'utf8' , (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);
      jsonData = JSON.parse(data);
      jsonData[itemName] = item;
      fs.writeFile(`${this.path}/HRLabData/auth.txt`, JSON.stringify(jsonData), (err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('The file has been saved!');
      });      
    });
    return true;
  }

  @Action({ rawError: true })
  isLoggedIn() {
    // get the current user. If undefined, nobody is logged in
    var currentUserIndex = JSON.parse(window.localStorage.getItem('currentUserIndex'));
    if (currentUserIndex != null) {
      return true;
    } else {
      return false;
    }
  }

  @Action({ rawError: true })
  getCurrentUser() {
    if (this.isLoggedIn()) {
      var currentUser = JSON.parse(localStorage.getItem('users'))[JSON.parse(window.localStorage.getItem('currentUserIndex'))];
      return currentUser;
    } else {
      window.location.href = './login.html';
      return null;
    }
  }

  @Action({ rawError: true })
  updateCurrentUser(newUser) {
    var existingUsers = JSON.parse(window.localStorage.getItem('users'));
    existingUsers[JSON.parse(localStorage.getItem('currentUserIndex'))] = newUser;
    localStorage.setItem('users', JSON.stringify(existingUsers));
  }

  @Action({ rawError: true })
  register(registerObject) {
    // registering a new user
    var newUser = {
      username: registerObject.username,
      password: registerObject.password,
      fullName: registerObject.fullName,
      AOO: {},
      VOO: {},
      AAI: {},
      VVI: {},
      DOO: {}
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
    console.log(newUser);
    existingUsers.push(newUser);
    window.localStorage.setItem('users', JSON.stringify(existingUsers));

    return true
  }

  @Action({ rawError: true })
  login(loginObject) {
    // get all users
    var existingUsers = JSON.parse(window.localStorage.getItem('users'));
    console.log(existingUsers);
    //loop through all users looking for a match
    let flag = false;
    existingUsers.forEach((user, index) => {
      if (user.username == loginObject.username) {
        if(user.password == loginObject.password) {
          // log user in and proceed to dashboard
          window.localStorage.setItem('currentUserIndex', JSON.stringify(index));
          flag = true;
        }
      }
    });
    console.log(flag);
    return flag;
  }

  @Action({ rawError: true })
  logout() {
    window.localStorage.setItem('currentUserIndex', JSON.stringify(null));
    window.location.href = './login.html';
  }

}
