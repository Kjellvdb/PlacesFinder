export default class Map {
  #map;

  constructor(pos) {
    this.#setMap(pos);
  }

  #setMap(pos) {
    this.#map = new google.maps.Map(document.getElementById("map"), {
      center: pos,
      zoom: 17,
      maxZoom: 18,
      minZoom: 10,
      mapTypeControl: false,
      disableDoubleClickZoom: true,
    });
  }

  get map() {
    return this.#map;
  }
}
