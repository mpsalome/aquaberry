<template>
  <form>
    <h2 class="title">Alterar Senha</h2>

    <b-field label="Usuário">
      <b-input id="usuario" v-model="usuario"></b-input>
    </b-field>
    <b-field label="Senha Atual">
      <b-input
        id="senhaAtual"
        type="password"
        v-model="senhaAtual"
        password-reveal
      >
      </b-input>
    </b-field>
    <b-field label="Nova Senha">
      <b-input
        id="novaSenha"
        type="password"
        v-model="novaSenha"
        password-reveal
      >
      </b-input>
    </b-field>
    <b-field label="Confirmar Senha">
      <b-input
        id="confirmarSenha"
        type="password"
        v-model="confirmarSenha"
        password-reveal
      >
      </b-input>
    </b-field>
    <b-field label="Serial">
      <b-input id="serial" v-model="serial" maxlength="20"></b-input>
    </b-field>
    <b-button
      type="is-dark"
      :disabled="
        usuario && novaSenha && confirmarSenha && serial && senhaAtual
          ? false
          : true
      "
      @click="updatePass"
      expanded
      >Salvar</b-button
    >
    <b-loading :is-full-page="true" v-model="isLoading"></b-loading>
    <b-modal
      v-model="isComponentModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-modal
      :can-cancel="false"
    >
      <template>
        <LoginModal />
      </template>
    </b-modal>
  </form>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";
import LoginModal from "@/components/LoginModal.vue"

export default {
  data() {
    return {
      isComponentModalActive: false,
      isLoading: false,
      usuario: "",
      senha: "",
      confirmarSenha: "",
      serial: "",
      novaSenha: "",
      senhaAtual: ""
    };
  },
  components: {
    LoginModal
  },
  created: function() {
    this.isLogged();
    if(!this.isComponentModalActive){
    }
  },
  methods: {
    isLogged() {
      if(!sessionStorage.getItem("token"))  this.isComponentModalActive = true
    },
    updatePass() {
      if (this.novaSenha !== this.confirmarSenha) {
        this.showDialog('As senhas não conferem!', 'is-warning')
        document.getElementById('confirmarSenha').focus()
      } else {
        this.isLoading = true
        let id = JSON.parse(sessionStorage.getItem('token')).idusuario;
        API.putChangePassword({usuario: this.usuario, senhaAtual: this.senhaAtual, novaSenha: this.novaSenha, idusuario: id, serial: this.serial}).then(data =>{
          if(data.toString().includes('Error')) {
            this.showDialog(`Erro ao alterar a senha. Tente novamente!`,'is-danger')
            this.isLoading = false
          }else {
            this.showDialog('Senha alterada com sucesso!','is-success')
            this.clearScreen()
            this.isLoading = false
          }
        })
      }
    },
    showDialog(message, type, ) {
      this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type
      })
    },
    clearScreen() {
      this.isLoading= false
      this.usuario= ""
      this.novaSenha= ""
      this.senhaAtual= ""
      this.confirmarSenha= ""
      this.serial= ""
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
