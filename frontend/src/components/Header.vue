<template>
  <header>
    <sidebar-menu :menu="menu" :collapsed="true" style="z-index: 2;" />
    <img src="../assets/rasp_logo.png" alt="Logo Raspberry Pi" class="logo" />
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {},
  components: {},
  data() {
    return {
      menu: [
        {
          href: "/",
          title: "Página Inicial",
          icon: "fa fa-home"
        },
        {
          href: "/configuracoes",
          title: "Configurações",
          icon: "fa fa-cog"
        },
        {
          href: "/alterar-senha",
          title: "Alterar Senha",
          icon: "fa fa-key"
        }
      ]
    };
  }
};
</script>
<style scoped>
header {
  min-width: 100%;
  height: 6vh;
  background-color: #000;
  position: fixed;
  top: 0;
  margin: 0;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 55px;
}
.logo {
  max-height: 80%;
  max-width: 100%;
}
</style>
