/* eslint-disable */
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Settings from "../views/Settings.vue"
import Password from "../views/Password.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/configuracoes",
    name: "Configurações",
    component: Settings
  },
  {
    path: "/alterar-senha",
    name: "AlterarSenha",
    component: Password
  }
];

const router = new VueRouter({
  routes
});

export default router;
