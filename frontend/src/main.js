/* eslint-disable */
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Buefy from "buefy";
import 'buefy/dist/buefy.css'
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import VueSvgGauge from 'vue-svg-gauge'
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";

Vue.use(VueSidebarMenu);
Vue.use(Buefy);
Vue.use(Buefy, {
  defaultIconPack: 'fas'
});
Vue.use(VueSvgGauge)

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
