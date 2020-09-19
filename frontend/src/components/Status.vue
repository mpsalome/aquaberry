<template>
  <div class="box__status row">
    <div class="col-12 col-md-6">
      Cooler: <span v-if="cooler">ligado</span><span v-else>desligado</span>
    </div>
    <div class="col-12 col-md-6">
      Filtro de Água: <span v-if="filtro">ligado</span
      ><span v-else>desligado</span>
    </div>
    <div class="col-12 col-md-6">
      LEDs: <span v-if="led">ligado</span><span v-else>desligado</span>
    </div>
    <div class="col-12 col-md-6">
      Aquecedor: <span v-if="aquecedor">ligado</span
      ><span v-else>desligado</span>
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
      cooler: true,
      filtro: true,
      led: true,
      aquecedor: true
    };
  },
  created: function() {
  },
  methods: {
  }
};
</script>

<style scoped lang="scss">
.box__status {
    margin-top: 15px;
}
</style>
