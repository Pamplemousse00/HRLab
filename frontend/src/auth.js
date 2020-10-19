
function isLoggedIn() {
  // get the current user. If undefined, nobody is logged in
  var currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
  if (currentUser.username != undefined) {
    return true;
  } else {
    return false;
  }
}

function getCurrentUser() {
  if (isLoggedIn()) {
    var currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
    return currentUser;
  } else {
    window.location.href = './login.html';
    return null;
  }
}

function register() {
  // registering a new user
  var newUser = {
    username: document.getElementById('registerUsername').value,
    password: document.getElementById('registerPassword').value,
    fullName: document.getElementById('registerFullName').value
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

function login() {
  // get all users
  var existingUsers = JSON.parse(window.localStorage.getItem('users'));
  var loginUser = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  }
  //loop through all users looking for a match
  existingUsers.forEach(user => {
    if (user.username == loginUser.username) {
      if(user.password == loginUser.password) {
        // log user in and proceed to dashboard
        window.localStorage.setItem('currentUser', JSON.stringify(user));
        this.window.location.href = './dashboard.html';
      }
    }
  });
}

function logout() {
  window.localStorage.setItem('currentUser', JSON.stringify({}));
  window.location.href = './login.html';
}