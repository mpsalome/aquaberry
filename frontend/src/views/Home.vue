<template>
  <div class="home">
    <Chart />
  </div>
</template>

<script>
import Chart from "@/components/Chart.vue";
export default {
  name: "Home",
  components: {
    Chart
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
