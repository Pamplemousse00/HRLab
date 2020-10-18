
function checkIfLoggedIn() {
  var currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
  if (currentUser.username != undefined) {
    return true;
  } else {
    return false;
  }
}

function register() {
  var newUser = {
    username: document.getElementById('registerUsername').value,
    password: document.getElementById('registerPassword').value
  }
  var existingUsers = JSON.parse(window.localStorage.getItem('users'));
  console.log(existingUsers);
  if (!existingUsers) {
    existingUsers = [];
  }
  existingUsers.push(newUser);
  window.localStorage.setItem('users', JSON.stringify(existingUsers));
  document.getElementById('registerModal').classList.remove('is-active');
  document.getElementById('notification').style.visibility = 'visible';
  setTimeout(function() {
    document.getElementById('notification').style.visibility = 'hidden';
  }, 2000);
}

function login() {
  var existingUsers = JSON.parse(window.localStorage.getItem('users'));
  var loginUser = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  }
  existingUsers.forEach(user => {
    if (user.username == loginUser.username) {
      if(user.password == loginUser.password) {
        window.localStorage.setItem('currentUser', JSON.stringify(loginUser));
        this.window.location.href = './dashboard.html';
      }
    }
  });
}
