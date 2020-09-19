<template>
  <div class="box__status row">
    <div class="col-12">
      Modo manual temperatura
      <b-switch
        name="modoManual"
        @change.native="manualToggle"
        type="is-success"
        v-model="status.manual.temperatura"
      ></b-switch>
    </div>
    <div class="col-12 col-md-6">
      <b-field>
        Cooler
        <b-switch
          name="cooler"
          @change.native="inputToggle"
          type="is-success"
          v-model="status.cooler"
          :disabled="!status.manual.temperatura"
        ></b-switch>
      </b-field>
    </div>
    <div class="col-12 col-md-6">
      <b-field>
        Aquecedor
        <b-switch
          name="aquecedor"
          @change.native="inputToggle"
          type="is-success"
          v-model="status.aquecedor"
          :disabled="!status.manual.temperatura"
        ></b-switch>
      </b-field>
    </div>
    <div class="col-12 col-md-6">
      <b-field>
        Filtro de Água
        <b-switch
          name="agua"
          @change.native="inputToggle"
          type="is-success"
          v-model="status.filtro"
        ></b-switch>
      </b-field>
    </div>
    <div class="col-12 col-md-6">
      <b-field>
        LEDs
        <b-switch
          name="led"
          @change.native="inputToggle"
          type="is-success"
          v-model="status.led"
        ></b-switch>
      </b-field>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";

export default {
  name: "Status",
  data: function() {
    return {
      status: {}
    };
  },
  created: function() {
    this.setStatus();
  },
  methods: {
    setStatus() {
      API.getStatusReles().then(value => {
        this.status = value;
        console.log(value);
      });
    },
    inputToggle(event) {
      if (event.target.checked) {
        API.postReleOn(event.target.name);
      } else {
        API.postReleOff(event.target.name);
      }
    },
    manualToggle(event) {
      if (event.target.checked) {
        API.postTempManualOn();
      } else {
        API.postTempManualOff();
      }
    }
  }
};
</script>

<style scoped lang="scss">
.box__status {
  margin-top: 15px;
}
</style>
