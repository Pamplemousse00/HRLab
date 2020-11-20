<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'HRLab',
}
</script>

<style lang="scss">
@import '../node_modules/bulma/bulma.sass';

html, body {
  font-family: 'Open Sans', Verdana, Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  height: 100%;
  background: #ECF0F3;
}
</style>