import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import App from './App.vue';
import router from './router';
import SetGameProcessor from './models/SetGameProcessor';

Vue.config.productionTip = false;

// create the comms object for the app
// Vue.use(VueNativeSock, 'ws://localhost:3000/ws', {
Vue.use(VueNativeSock, `ws://${window.location.host}/ws`, {
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  format: 'json',
});

const setGameProcessor = new SetGameProcessor();

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
