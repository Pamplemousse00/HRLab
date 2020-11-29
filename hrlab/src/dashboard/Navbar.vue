<template>
  <div>
    <b-navbar class="is-dark">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="./logoSmall.png" height="28">
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item href="#">
          Not Connected To Device
        </b-navbar-item>
        <b-navbar-item href="#">
          Not Logged In
        </b-navbar-item>
        <b-navbar-item href="#">
          About
        </b-navbar-item>
        <b-navbar-item href="#">
          Log out
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

