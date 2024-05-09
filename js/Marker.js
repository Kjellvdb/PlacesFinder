export default class Marker {
  #pos;
  #map;
  #marker;

  constructor(pos, map) {
    this.#pos = pos;
    this.#map = map;
    this.#marker = new google.maps.Marker({
      position: this.#pos,
      map: this.#map,
      title: "current position",
    });
  }

  get marker() {
    return this.#marker;
  }

  show() {
    this.#marker.setMap(this.#map);
  }

  hide() {
    this.#marker.setMap(null);
  }
}
