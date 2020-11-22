import axios from "axios";

const IP = `${process.env.VUE_APP_IP}:3010`;

export default {
  getTemperatura() {
    return axios.get(`${IP}/temperatura`).then(response => {
      return response.data;
    });
  },
  getPh() {
    return axios.get(`${IP}/ph`).then(response => {
      return response.data;
    });
  },
  getStatusReles() {
    return axios.get(`${IP}/statusReles`).then(response => {
      return response.data;
    });
  },
  postReleOff(rele) {
    return axios
      .post(`${IP}/releOff`, { nome: rele })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  },
  postReleOn(rele) {
    return axios
      .post(`${IP}/releOn`, { nome: rele })
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  },
  postTempManualOn() {
    return axios
      .post(`${IP}/tempManualOn`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  },
  postTempManualOff() {
    return axios
      .post(`${IP}/tempManualOff`)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  }
};
