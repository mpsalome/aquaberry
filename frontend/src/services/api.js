function get(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

export default {
  getTemperatura() {
    var json = JSON.parse(get("http://192.168.15.48:3010/temperatura"));
    return json;
  }
};
