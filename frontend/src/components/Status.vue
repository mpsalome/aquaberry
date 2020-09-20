<template>
  <div class="box__status row">
    <div class="col-12">
      Controle manual de temperatura
      <b-switch
        name="modoManual"
        @change.native="showConfirmDialog"
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
          v-model="status.filtroagua"
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
    this.setStatus();
    var wsStatus = new WebSocket("ws://192.168.15.15:3011/");
    wsStatus.onmessage = event => {
      let data = JSON.parse(event.data);
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
    };
  },
  methods: {
    setStatus() {
      API.getStatusReles().then(value => {
        this.status = value;
      });
    },
    inputToggle(event) {
      event.target.disabled = true
      if (event.target.checked) {
        API.postReleOn(event.target.name).then(() => {
          this.$buefy.toast.open({message: `${event.target.name.toUpperCase()} ligado`});
          event.target.disabled = false
        });
      } else {
        API.postReleOff(event.target.name).then(() => {
          this.$buefy.toast.open({message: `${event.target.name.toUpperCase()} desligado`});
          event.target.disabled = false
        });
      }
    },
    manualToggle(event) {
      event.target.disabled = true
      if (event.target.checked) {
        API.postTempManualOn().then(() => {
          this.$buefy.toast.open({message: `Controle manual de temperatura ligado`});
          event.target.disabled = false
        });
      } else {
        API.postTempManualOff().then(() => {
          this.$buefy.toast.open({message: `Controle manual de temperatura desligado`});
          event.target.disabled = false
        });
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
    },
    showConfirmDialog(event) {
      this.$buefy.dialog.confirm({
        title: "Atenção!",
        message: "Ao ligar o controle manual de temperatura o AquaBerry não cuidará mais da temperatura de seu aquário. \nDeseja continuar?",
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        type: "is-warning",
        iconPack: "fa",
        icon: "exclamation-triangle",
        hasIcon: true,
        ariaRole: "alertdialog",
        onConfirm: () => {this.manualToggle(event)},
        onCancel: () => {event.target.checked = false}
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
