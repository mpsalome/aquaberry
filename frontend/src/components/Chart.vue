<template>
  <div class="chart">
    <div class="row justify-content-center">
      <div class="gauge__box col-10 col-md-6">
        <VueSvgGauge
          :start-angle="-110"
          :end-angle="110"
          :value="temperatura"
          :separator-step="10"
          :min="0"
          :max="60"
          :gauge-color="[
            { offset: 0, color: '#5ab0f2' },
            { offset: 100, color: '#f23729' }
          ]"
          :scale-interval="5"
        />
        <p class="gauge__text">Temperatura: {{ temperatura }}ºC</p>
      </div>
      <div class="gauge__box col-10 col-md-6 d-none">
        <VueSvgGauge
          :start-angle="-110"
          :end-angle="110"
          :value="ph"
          :separator-step="1"
          :min="0"
          :max="14"
          :gauge-color="[
            { offset: 0, color: '#ff0000' },
            { offset: 100, color: '#5b0eb3' }
          ]"
          :scale-interval="1"
        />
        <p class="gauge__text">pH: {{ ph }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";

export default {
  name: "Chart",
  props: {},
  data: function() {
    return {
      temperatura: 0,
      ph: 5
    };
  },
  created: function() {
      var wsTemp = new WebSocket("ws://192.168.15.15:3011/");
      wsTemp.onmessage = event => {
        let data = JSON.parse(event.data)
        this.temperatura = Number(data.temperatura);
      };
      wsTemp.onerror= event => {
        this.showDialog("Erro!", "Desculpe, um erro ocorreu. \nPor favor tente novamente em alguns segundos", "is-danger", "times-circle", "alertdialog" )
      }
  },
  methods: {
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
.chart {
  margin: 0 auto;
  .gauge__box {
    &:not(:first-child) {
      margin-top: 40px;
    }
    .gauge__text {
      position: relative;
      bottom: 35%;
      font-size: 0.8em;
    }
  }
}
@media only screen and (min-width: 768px) {
  .chart {
    .gauge__box {
      &:not(:first-child) {
        margin-top: 0;
      }
      .gauge__text {
        font-size: 1.2em;
      }
    }
  }
}
</style>
