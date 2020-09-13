/* eslint-disable */
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Buefy from "buefy";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";

Vue.use(VueSidebarMenu);
Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
