<template>
  <form action="">
    <div class="modal-card" style="width: auto">
      <header class="modal-card-head">
        <p class="modal-card-title">Bem vindo!</p>
        <button type="button" class="delete" @click="$emit('close')" />
      </header>
      <section class="modal-card-body">
        <b-field label="Usuário">
          <b-input type="text" v-model="user" placeholder="Usuário" required>
          </b-input>
        </b-field>

        <b-field label="Senha">
          <b-input
            type="password"
            v-model="password"
            password-reveal
            placeholder="Senha"
            required
          >
          </b-input>
        </b-field>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-link" @click="login">Entrar</button>
      </footer>
    </div>
    <b-loading :is-full-page="false" v-model="isLoading"></b-loading>
  </form>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";

export default {
  name: "Chart",
  props: {},
  data() {
    return {
        user: '',
        password: '',
        isLoading: false
    };
  },
  methods: {
    login() {
        if (this.user && this.password) {
            this.isLoading = true
            API.postLogin({usuario: this.user, senha: this.password}).then(data =>{
              if(data.toString().includes('Error')) {
                this.showDialog('Erro ao efetuar login. Tente novamente!','is-danger')
                this.isLoading = false
              }else {
                sessionStorage.setItem('token', JSON.stringify(data.data))
                this.$parent.close()
                this.isLoading = false
                this.$router.push('/')
              }
            })
        }
    }, 
    showDialog(message, type ) {
      this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type
      })
    },
  }

};
</script>

<style scoped lang="scss">
.modal-close, .delete {
  display: none;
}
</style>
