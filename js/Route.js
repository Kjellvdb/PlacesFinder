export default class Route {
  #map;
  #currentPos;
  #bestemming;
  #vervoersmiddel;
  #directionsRenderer;

  constructor(map, currentPos, bestemming, vervoersmiddel, directionsRenderer) {
    this.#map = map;
    this.#currentPos = currentPos;
    this.#bestemming = bestemming;
    this.#vervoersmiddel = vervoersmiddel;
    this.#directionsRenderer = directionsRenderer;
  }

  toonRoute() {
    const directionsService = new google.maps.DirectionsService();
    let vervoersType = null;
    switch (this.#vervoersmiddel) {
      case "1":
        vervoersType = google.maps.TravelMode.BICYCLING;
        break;
      case "2":
        vervoersType = google.maps.TravelMode.DRIVING;
        break;
      case "3":
        vervoersType = google.maps.TravelMode.WALKING;
        break;
      default:
        vervoersType = google.maps.TravelMode.TRANSIT;
        break;
    }
    directionsService
      .route({
        origin: this.#currentPos,
        destination: this.#bestemming,
        travelMode: vervoersType,
      })
      .then((response) => {
        this.#directionsRenderer.setDirections(response);
      });
  }
}
