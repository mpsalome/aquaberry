<template>
  <div class="chart">
    <h1>teste</h1>
  </div>
</template>

<script>
import API from "@/services/api";

/* eslint-disable */
export default {
  name: "Chart",
  props: {},
  mounted: function() {
    console.log("teste");
    console.log(API.getTemperatura());
  }
};
</script>

<style scoped lang="scss"></style>
