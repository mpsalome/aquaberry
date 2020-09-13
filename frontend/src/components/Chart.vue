<template>
  <div class="chart">
    <h1>teste</h1>
  </div>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";

export default {
  name: "Chart",
  props: {},
  mounted: function() {
    console.log("teste");
    try {
      // console.log(API.getTemperatura());
    } catch (error) {
      // console.log(error)      
    }
  }
};
</script>

<style scoped lang="scss"></style>
