<template>
  <div class="box__status row">
    <div class="col-12">
      <p>Hora atual do sistema: {{ formatHora() }}</p>
    </div>
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
    <b-loading :is-full-page="true" v-model="isLoading"></b-loading>
  </div>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";

export default {
  name: "Status",
  data: function() {
    return {
      isLoading: false,
      status: {
        aquecedor: false,
        filtroagua: false,
        cooler: false,
        led: false,
        manual: {
          temperatura: false,
          iluminacao: false
        },
        hora: ""
      }
    };
  },
  created: function() {
    this.setStatus();
    var wsStatus = new WebSocket(`ws://${process.env.VUE_APP_IP}:3011/`);
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
      this.isLoading = true;
      API.getStatusReles().then(value => {
        value.hora = this.formatHora(value)
        this.status = value;
        this.isLoading = false;
      });
    },
    formatHora(value = this.status) {
      let formatedHora = []
        value.hora.split(':', 2).forEach(hora => {
          if (hora.length === 1) {
            formatedHora.push("0" + hora)
          }else {
            formatedHora.push(hora)
          }
        });
        return formatedHora.join(":")
    },
    inputToggle(event) {
      this.isLoading = true;
      if (event.target.checked) {
        event.target.disabled = true;
        API.postReleOn(event.target.name).then(() => {
          this.$buefy.toast.open({
            message: `${event.target.name.toUpperCase()} ligado`
          });
          this.setStatus();
          this.isLoading = false;
        });
      } else {
        event.target.disabled = true;
        API.postReleOff(event.target.name).then(() => {
          this.$buefy.toast.open({
            message: `${event.target.name.toUpperCase()} desligado`
          });
          event.target.disabled = false;
          this.isLoading = false;
        });
      }
    },
    manualToggle(event) {
      this.isLoading = true;
      event.target.disabled = true;
      if (event.target.checked) {
        API.postTempManualOn().then(() => {
          this.$buefy.toast.open({
            message: `Controle manual de temperatura ligado`
          });
          event.target.disabled = false;
          event.target.checked = true;
          event.target.disabled = false;
          this.isLoading = false;
        });
      } else {
        API.postTempManualOff().then(() => {
          this.$buefy.toast.open({
            message: `Controle manual de temperatura desligado`
          });
          event.target.disabled = false;
          event.target.checked = false;
          this.isLoading = false;
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
      if (!event.target.checked) {
        this.manualToggle(event);
      } else {
        this.$buefy.dialog.confirm({
          title: "Atenção!",
          message:
            "Ao ligar o controle manual de temperatura o AquaBerry não cuidará mais da temperatura de seu aquário. \nDeseja continuar?",
          confirmText: "Continuar",
          cancelText: "Cancelar",
          type: "is-warning",
          iconPack: "fa",
          icon: "exclamation-triangle",
          hasIcon: true,
          ariaRole: "alertdialog",
          onConfirm: () => {
            this.manualToggle(event);
          },
          onCancel: () => {
            event.target.checked = false;
          }
        });
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
