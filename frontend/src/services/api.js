const axios = require("axios");

function get(theUrl) {
  axios
    .get(theUrl)
    .then(function(response) {
      return response;
    })
    .catch(function(error) {
      return error;
    });
}

function post(theUrl, body) {
  axios
    .post(theUrl, body)
    .then(function(response) {
      return response;
    })
    .catch(function(error) {
      return error;
    });
}

const IP = "http://192.168.15.15:3010";

export default {
  getTemperatura() {
    var value = get(`${IP}/temperatura`);
    return value;
  },
  getPh() {
    var value = get(`${IP}/ph`);
    return value;
  },
  getStatusReles() {
    var value = get(`${IP}/statusReles`);
    return value;
  },
  postReleOff() {
    var value = post(`${IP}/releOff`);
    return value;
  },
  postReleOn() {
    var value = post(`${IP}/releOn`);
    return value;
  }
};
