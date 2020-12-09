<template>
  <section>
    <h2 class="title">Configurações</h2>

    <h3 class="subtitle">Controle de Temperatura</h3>
    <b-tooltip label="Temperatura Máxima do aquário">
      <b-field>
        <b-input
          required
          placeholder="Temperatura Máxima"
          type="number"
          icon-pack="fas"
          icon="thermometer-full"
          v-model="maxTemp"
          :disabled="maxTemp !== '' ? true : false"
          class="maxTemp"
        ></b-input>
        <b-icon
          pack="fa"
          class="fakeButton maxTemp"
          icon="edit"
          size="is-small"
          @click.native="editInfo"
        >
        </b-icon>
      </b-field>
    </b-tooltip>
    <b-tooltip label="Temperatura Ideal do aquário">
      <b-field>
        <b-input
          required
          placeholder="Temperatura Ideal"
          type="number"
          icon-pack="fas"
          icon="thermometer-half"
          v-model="idealTemp"
          :disabled="idealTemp !== '' ? true : false"
          class="idealTemp"
        ></b-input>
        <b-icon
          pack="fa"
          class="fakeButton idealTemp"
          icon="edit"
          size="is-small"
          @click.native="editInfo"
        >
        </b-icon>
      </b-field>
    </b-tooltip>
    <b-tooltip label="Temperatura Mínima do aquário">
      <b-field>
        <b-input
          required
          placeholder="Temperatura Mínima"
          type="number"
          icon-pack="fas"
          icon="thermometer-empty"
          v-model="minTemp"
          :disabled="minTemp !== '' ? true : false"
          class="minTemp"
        ></b-input>
        <b-icon
          pack="fa"
          class="fakeButton minTemp"
          icon="edit"
          size="is-small"
          @click.native="editInfo"
        >
        </b-icon>
      </b-field>
    </b-tooltip>
    <h3 class="subtitle">Controle de Alimentação</h3>
    <b-tooltip label="Horário de Alimentação">
      <b-field v-for="(hora, index) in horaAlimentacao" :key="index">
        <b-input
          required
          placeholder="Horário de alimentação do peixe"
          icon-pack="far"
          icon="clock"
          v-model="hora.value"
          :disabled="hora.value.length < 8 ? false : true"
          class="deleteTimer newTimer"
          v-cleave="masks.time"
        ></b-input>
        <b-icon
          pack="fa"
          class="fakeButton deleteTimer"
          icon="trash"
          size="is-small"
          @click.native="editInfo"
        >
        </b-icon>
      </b-field>
    </b-tooltip>
    <b-button type="is-info" icon-left="plus" class="newTimer" @click="addHora"
      >Adicionar horário</b-button
    >
    <h3 class="subtitle">Controle da Iluminação</h3>
    <b-tooltip label="Hora de ínicio do ciclo de luz">
      <b-field>
        <b-input
          required
          placeholder="Hora Inicio"
          icon-pack="far"
          icon="sun"
          v-model="iniLuz"
          :disabled="iniLuz !== '' ? true : false"
          class="startTime"
          v-cleave="masks.time"
        ></b-input>
        <b-icon
          pack="fa"
          class="fakeButton startTime"
          icon="edit"
          size="is-small"
          @click.native="editInfo"
        >
        </b-icon>
      </b-field>
    </b-tooltip>
    <b-tooltip label="Hora de fim do ciclo de luz">
      <b-field>
        <b-input
          required
          placeholder="Hora Fim"
          icon-pack="far"
          icon="moon"
          v-model="fimLuz"
          :disabled="fimLuz !== '' ? true : false"
          class="endTime"
          v-cleave="masks.time"
        ></b-input>
        <b-icon
          pack="fa"
          class="fakeButton endTime"
          icon="edit"
          size="is-small"
          @click.native="editInfo"
        >
        </b-icon>
      </b-field>
    </b-tooltip>
    <div class="buttons">
      <b-button
        type="is-dark"
        @click="sendNewInfo"
        expanded
        :disabled="actionsMade.length !== 0 ? false : true"
        >Salvar Informações</b-button
      >
    </div>
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
  </section>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";
import Cleave from 'cleave.js'
import LoginModal from "@/components/LoginModal.vue"

const cleave = {
  name: 'cleave',
  bind(el, binding) {
      const input = el.querySelector('input')
      input._vCleave = new Cleave(input, binding.value)
  },
  unbind(el) {
      const input = el.querySelector('input')
      input._vCleave.destroy()
  }
}

export default {
  directives: { cleave },
  data() {
    return {
      maxTemp: "",
      minTemp: "",
      idealTemp: "",
      horaAlimentacao: [],
      iniLuz: "",
      fimLuz: "",
      isLoading: false,
      infoEdit: false,
      actionsMade: [],
      deletedHora: [],
      isComponentModalActive: false,
      masks: {
        time: {
            delimiters: [':', ':'],
            blocks: [2, 2, 2],
            numericOnly: true
        }
      }
    };
  },
  components: {
    LoginModal
  },
  created: function() {
    this.isLogged();
    if(!this.isComponentModalActive){
      this.setConfigTimer();
      this.setConfigTemp();
    }
  },
  methods: {
    isLogged() {
      if(!sessionStorage.getItem("token"))  this.isComponentModalActive = true
    },
    addHora (event) {
      this.horaAlimentacao.push({ value: "" });
      this.editInfo(event)
    },
    setConfigTimer() {
      this.isLoading = true;
      API.getConfigTimer().then(data => {
        data.forEach( el =>{
          if(el.idsensor === 5){
            if (el.acao === 0) {
              this.iniLuz = el.hora
            } else {
              this.fimLuz= el.hora
            }
          }
          else if (el.idsensor === 6) {
            this.horaAlimentacao.push({value: el.hora})
          }
        })
        this.isLoading = false;
      });
    },
    setConfigTemp() {
      API.getConfigTemp().then(data => {
        this.maxTemp = data[0].tempmax;
        this.minTemp = data[0].tempmin;
        this.idealTemp = data[0].tempideal;
        this.isLoading = false;
      });
    },
    returnValue(data, arg) {
      data.for
    },
    editInfo(event){
      if (event.currentTarget.className.includes('maxTemp')) {
        this.actionsMade.push('maxTemp')
        document.querySelector('div.maxTemp > input').disabled = false;
      } 
      else if (event.currentTarget.className.includes('idealTemp')) {
        this.actionsMade.push('idealTemp')
        document.querySelector('div.idealTemp > input').disabled = false;
      } 
      else if (event.currentTarget.className.includes('minTemp')) {
        this.actionsMade.push('minTemp')
        document.querySelector('div.minTemp > input').disabled = false;
      }
      else if (event.currentTarget.className.includes('startTime')) {
        this.actionsMade.push('startTime')
        document.querySelector('div.startTime > input').disabled = false;
      }
      else if (event.currentTarget.className.includes('endTime')) {
        this.actionsMade.push('endTime')
        document.querySelector('div.endTime > input').disabled = false;
      }
      else if (event.currentTarget.className.includes('deleteTimer')) {
        let hora = event.currentTarget.previousSibling.firstChild.value
        this.deletedHora.push({value: hora})
        let index = this.horaAlimentacao.findIndex(el => el.value === hora)
        this.horaAlimentacao.splice(index,1)
        this.actionsMade.push('deleteTimer')
      }else if(event.currentTarget.className.includes('newTimer')) {
        this.actionsMade.push('newTimer')
      }
    }, 
    sendNewInfo(){
      if(!this.maxTemp || !this.minTemp || !this.horaAlimentacao || !this.iniLuz || !this.fimLuz || !this.idealTemp){
        this.showDialog('Por favor preencha todos os campos!', 'is-warning');
      }else {
        if (this.actionsMade.includes('maxTemp') || this.actionsMade.includes('idealTemp') || this.actionsMade.includes('minTemp')) {
            this.isLoading = true;
            API.putConfigTemp({tempmin: this.minTemp, tempideal: this.idealTemp,tempmax: this.maxTemp}).then(data => {
              this.showDialog("Informações salvas.", "is-success")
              document.querySelectorAll('div.control > input').forEach(el => {
                el.disabled = true
              })
              this.isLoading = false;
            });
          }
          if (this.actionsMade.includes('startTime')) {
              this.isLoading = true;
              API.putConfigTimer({idsensor: "5", acao: "0", hora: `${this.iniLuz}`}).then(data => {
                this.showDialog("Informações salvas.", "is-success")
                document.querySelectorAll('div.control > input').forEach(el => {
                  el.disabled = true
                })
                this.isLoading = false;
              });
          } 
          if (this.actionsMade.includes('endTime')) {
              this.isLoading = true;
              API.putConfigTimer({idsensor: "5", acao: "1", hora: `${this.fimLuz}`}).then(data => {
                this.showDialog("Informações salvas.", "is-success")
                document.querySelectorAll('div.control > input').forEach(el => {
                  el.disabled = true
                })
                this.isLoading = false;
              });
          } 
          if (this.actionsMade.includes('deleteTimer')) {
              this.isLoading = true;
              let itensProcessed = 0
              this.deletedHora.forEach((hora, index, array) => {
                  let timer = {acao: 0, hora: hora.value}
                  console.log(timer)
                  API.deleteConfigTimer(timer).then(data => {
                    this.showDialog("Informações salvas.", "is-success")
                    document.querySelectorAll('div.control > input').forEach(el => {
                      el.disabled = true
                    })
                    itensProcessed++
                    if (itensProcessed === array.length) {
                      this.isLoading = false;
                    }
                });
              });
          }
          if (this.actionsMade.includes('newTimer')) {
            this.isLoading = true;
            let itensProcessed = 0
            this.horaAlimentacao.forEach((hora, index, array) => {
              API.postNewFeedTime({hora: hora.value}).then(data => {
                this.showDialog("Informações salvas.", "is-success")
                document.querySelectorAll('div.control > input').forEach(el => {
                  el.disabled = true
                })
                this.isLoading = false;
              })
            })
          }
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
  }
};
</script>
<style lang="scss" scoped>
  .control {
    width: 100%;
  }
  .fakeButton {
    position: relative;
    top: 31%;
    left: 10px;
    cursor: pointer;
  }
  span.b-tooltip {
    width: 100%;
    margin-bottom: 20px;
  }
</style>
