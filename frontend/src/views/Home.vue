<template>
  <div class="home">
    <div class="row">
      <div class="col">
        <h1 class="title">Bem-vindo ao Aquaberry</h1>
      </div>
    </div>
    <Status />
    <Chart />
  </div>
</template>

<script>
import Chart from "@/components/Chart.vue";
import Status from "@/components/Status.vue";
export default {
  name: "Home",
  components: {
    Chart,
    Status
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
