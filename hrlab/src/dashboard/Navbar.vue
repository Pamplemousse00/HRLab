<template>
  <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="./dashboard.html">
        <img src="./logoSmall.png" height="28">
      </a>
  
      <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
  
    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        
        <a class="navbar-item" id="navbarConnection" onclick="openDeviceModal()" style="color: hsl(348, 100%, 61%)">
          Not Connected to Device 
        </a>

        <a class="navbar-item" id="navbarName" onclick="openProfileModal()">
          Not Logged in
        </a>

        <a class="navbar-item" onclick="openAboutModal()">
          About
        </a>
        
        <a class="navbar-item" onclick="logout()">
          Logout
        </a>
        
      </div>
    </div>
  </nav>
</template>