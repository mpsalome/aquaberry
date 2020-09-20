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
      status: {
        aquecedor: false,
        filtroagua: false,
        cooler: false,
        led: false,
        manual: {
          temperatura: false,
          iluminacao: false
        }
      }
    };
  },
  created: function() {
    this.setStatus()
    var wsStatus = new WebSocket("ws://192.168.15.15:3011/");
    wsStatus.onmessage = event => {
      let data = JSON.parse(event.data)
      console.log(data)
      this.status = data;
    };
    wsStatus.onerror = event => {
      this.showDialog(
        "Erro!",
        "Desculpe, um erro ocorreu. \nPor favor tente novamente em alguns segundos",
        "is-danger",
        "times-circle",
        "alertdialog"
      );
      console.log(event);
    };
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
    },
    showDialog(title, message, type, icon, ariaRole) {
      this.$buefy.dialog.alert({
        title,
        message,
        type,
        hasIcon: true,
        icon,
        iconPack: "fa",
        ariaRole,
        ariaModal: true
      });
    }
  }
};
</script>

<style scoped lang="scss">
.box__status {
  margin-top: 15px;
}
</style>
