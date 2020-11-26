<template>
  <section>
    <h2 class="title">Configurações</h2>

    <h3 class="subtitle">Controle de Temperatura</h3>
    <b-field>
      <b-input
        placeholder="Temperatura Máxima"
        type="number"
        icon-pack="fas"
        icon="thermometer-full"
        v-model="maxTemp"
        :disabled="maxTemp !== '' ? true : false"
      ></b-input>
    </b-field>
    <b-field>
      <b-input
        placeholder="Temperatura Ideal"
        type="number"
        icon-pack="fas"
        icon="thermometer-half"
        v-model="idealTemp"
        :disabled="idealTemp !== '' ? true : false"
      ></b-input>
    </b-field>
    <b-field>
      <b-input
        placeholder="Temperatura Mínima"
        type="number"
        icon-pack="fas"
        icon="thermometer-empty"
        v-model="minTemp"
        :disabled="minTemp !== '' ? true : false"
      ></b-input>
    </b-field>

    <h3 class="subtitle">Controle de Alimentação</h3>
    <b-field v-for="(hora, index) in horaAlimentacao" :key="index">
      <b-input
        placeholder="Horário de alimentação do peixe"
        icon-pack="far"
        icon="clock"
        v-model="hora.value"
        :disabled="hora.value !== '' ? true : false"
      ></b-input>
    </b-field>
    <b-button type="is-info" icon-left="plus" @click="addHora"
      >Adicionar horário</b-button
    >
    <h3 class="subtitle">Controle da Iluminação</h3>
    <b-field>
      <b-input
        placeholder="Hora Inicio"
        icon-pack="far"
        icon="sun"
        v-model="iniLuz"
        :disabled="iniLuz !== '' ? true : false"
      ></b-input>
    </b-field>
    <b-field>
      <b-input
        placeholder="Hora Fim"
        icon-pack="far"
        icon="moon"
        v-model="fimLuz"
        :disabled="fimLuz !== '' ? true : false"
      ></b-input>
    </b-field>
    <div class="buttons">
      <b-button type="is-dark" expanded>Salvar Informações</b-button>
    </div>
  </section>
</template>

<script>
/* eslint-disable */
import API from "@/services/api";

export default {
  data() {
    return {
      maxTemp: "",
      minTemp: "",
      idealTemp: "",
      horaAlimentacao: [],
      iniLuz: "",
      fimLuz: ""
    };
  },
  created: function() {
    this.setConfigTimer();
    this.setConfigTemp();
  },
  methods: {
    addHora: function() {
      this.horaAlimentacao.push({ value: "" });
    },
    setConfigTimer() {
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
      });
    },
    setConfigTemp() {
      API.getConfigTemp().then(data => {
        this.maxTemp = data[0].tempmax;
        this.minTemp = data[0].tempmin;
        this.idealTemp = data[0].tempideal;
      });
    },
    returnValue(data, arg) {
      data.for
    }
  }
};
</script>
