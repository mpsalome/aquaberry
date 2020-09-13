<template>
  <div id="app">
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap-grid.min.css"
    />
    <Header />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header";

export default {
  name: "app",
  components: {
    Header
  }
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");
#app {
  font-family: "Roboto", sans-serif;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.container {
  padding-top: 7vh;
}
</style>
