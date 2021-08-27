import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import SetMain from './views/SetMain.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/main',
      name: 'setMain',
      component: SetMain,
    },
  ],
});
