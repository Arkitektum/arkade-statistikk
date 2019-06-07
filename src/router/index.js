import Vue from 'vue';
import VueRouter from 'vue-router';
import StartPage from '@/pages/Start.vue';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartPage
    },
    {
      path: '/:chart',
      component: StartPage
    }
  ]
});
