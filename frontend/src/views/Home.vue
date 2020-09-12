<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Chart />
  </div>
</template>

<script>
// @ is an alias to /src
import Chart from "@/components/Chart.vue";


export default {
  name: "Home",
  components: {
    Chart
  }
};
</script>
