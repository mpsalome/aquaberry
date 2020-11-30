<template>
  <div class="home">
    <div class="row">
      <div class="col">
        <h1 class="title">Bem-vindo ao Aquaberry</h1>
      </div>
    </div>
    <Status />
    <Chart />
    <b-modal
      v-model="isComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-modal
      :can-cancel="false"
    >
      <template>
        <LoginModal />
      </template>
    </b-modal>
  </div>
</template>

<script>
/* eslint-disable */
import Chart from "@/components/Chart.vue";
import Status from "@/components/Status.vue";
import LoginModal from "@/components/LoginModal.vue"
import API from "@/services/api";

export default {
  name: "Home",
  components: {
    Chart,
    Status,
    LoginModal
  },
  data() {
    return {
      isComponentModalActive: false
    }
  },
  created: function() {
    this.isLogged()
  },
  methods: {
    isLogged() {
      if(!sessionStorage.getItem("token"))  this.isComponentModalActive = true
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  text-align: center;
  margin: 0 auto;
  display: inline;
}
</style>
