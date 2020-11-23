import Vue from 'vue'
import router from '@/router'
import App from './App.vue'
import Buefy from 'buefy'
import store from './store'

Vue.config.productionTip = false
Vue.use(Buefy)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
