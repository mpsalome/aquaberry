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
      ></b-input>
    </b-field>
    <b-field>
      <b-input
        placeholder="Temperatura Ideal"
        type="number"
        icon-pack="fas"
        icon="thermometer-half"
        v-model="idealTemp"
      ></b-input>
    </b-field>
    <b-field>
      <b-input
        placeholder="Temperatura Mínima"
        type="number"
        icon-pack="fas"
        icon="thermometer-empty"
        v-model="minTemp"
      ></b-input>
    </b-field>

    <h3 class="subtitle">Controle de Alimentação</h3>
    <b-field v-for="(hora, index) in horaAlimentacao" :key="index">
      <b-input
        placeholder="Horário de alimentação do peixe"
        icon-pack="far"
        icon="clock"
        v-model="hora.value"
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
      ></b-input>
    </b-field>
    <b-field>
      <b-input
        placeholder="Hora Fim"
        icon-pack="far"
        icon="moon"
        v-model="fimLuz"
      ></b-input>
    </b-field>
    <div class="buttons">
      <b-button type="is-dark" expanded>Salvar Informações</b-button>
    </div>
  </section>
</template>

<script>
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
  methods: {
    addHora: function() {
      this.horaAlimentacao.push({ value: "" });
    }
  }
};
</script>
