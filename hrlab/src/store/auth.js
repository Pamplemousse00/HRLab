import {
  Module, VuexModule, Mutation, Action,
} from 'vuex-module-decorators';

import fs from 'fs';

const path = require('electron').remote.app.getAppPath().replace("app.asar", "app.asar.unpacked");

@Module({
  name: 'auth',
  namespaced: true,
})
export default class AuthState extends VuexModule {

  @Action({ rawError: true })
  async getItem(itemName) {
    let returnData;
    if(await fs.existsSync(`${path}/users.json`)) {
      let data = await fs.readFileSync(`${path}/users.json`, 'utf8');

      let jsonData;
      if(data.length > 0) {
        jsonData = JSON.parse(data);
        returnData = jsonData[itemName];
        return returnData;
      } else {
        return null;
      }
    } else {
      await fs.writeFileSync(`${path}/users.json`, '');
      return null;
    }
    
  }

  @Action({ rawError: true })
  async setItem(setItemObject) {
    console.log(setItemObject);
    let data = await fs.readFileSync(`${path}/users.json`, 'utf8');
    console.log('AAAAAAA');
    let jsonData = {};
    if(data.length > 0) {
      jsonData = JSON.parse(data);
    }
    console.log(jsonData);
    jsonData[setItemObject.itemName] = setItemObject.item;
    
    await fs.writeFileSync(`${path}/users.json`, JSON.stringify(jsonData));
    console.log('The file has been saved!');   
    return true;
  }

  @Action({ rawError: true })
  async isLoggedIn() {
    // get the current user. If undefined, nobody is logged in
    var currentUserIndex = await this.getItem('currentUserIndex');
    if (currentUserIndex != null) {
      return true;
    } else {
      return false;
    }
  }

  @Action({ rawError: true })
  async getCurrentUser() {
    if (await this.isLoggedIn()) {
      var users = await this.getItem('users');
      var currentUser = users[await this.getItem('currentUserIndex')];
      return currentUser;
    } else {
      return null;
    }
  }

  @Action({ rawError: true })
  async updateCurrentUser(newUser) {
    var existingUsers = await this.getItem('users');
    existingUsers[await this.getItem('currentUserIndex')] = newUser;
    await this.setItem({ itemName: 'users', item: existingUsers });
  }

  @Action({ rawError: true })
  async register(registerObject) {
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
    var existingUsers = await this.getItem('users');

    // first-time initialization of 'existingUsers'
    if (existingUsers == undefined) {
      existingUsers = [];
    }
  
    if(existingUsers.length > 9) {
      alert('Number of supported users exceeded (10). Please clear local storage.');
      return;
    }
    // append new user to storage
    console.log(newUser);
    existingUsers.push(newUser);
    console.log(existingUsers);
    if(await this.setItem({ itemName: 'users', item: existingUsers })) {
      console.log('BBBBB');
    }
  }

  @Action({ rawError: true })
  async login(loginObject) {
    // get all users
    var existingUsers = await this.getItem('users');
    //loop through all users looking for a match
    let flag = false;
    if(existingUsers !== null) {
      for(let i = 0; i < existingUsers.length; i++) {
        if (existingUsers[i].username == loginObject.username) {
          if(existingUsers[i].password == loginObject.password) {
            // log user in and proceed to dashboard
            await this.setItem({ itemName: 'currentUserIndex', item: i });
            flag = true;
          }
        }
      }
    }
    console.log(flag);
    return flag;
  }

  @Action({ rawError: true })
  async logout() {
    await this.setItem({ itemName: 'currentUserIndex', item: null });
  }
}
