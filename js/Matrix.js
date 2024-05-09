export default class Matrix {
  #results;
  #vervoersmiddel;

  constructor(results, vervoersmiddel) {
    this.#results = results;
    this.#vervoersmiddel = vervoersmiddel;
  }

  berekenAfstand(huidigeLocatie, callback) {
    const destinationsList = [];
    this.#results.forEach((result) => {
      if (result.geometry.location != undefined)
        destinationsList.push({
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
        });
    });
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
    const request = {
      origins: [huidigeLocatie],
      destinations: destinationsList,
      travelMode: vervoersType,
      unitSystem: google.maps.UnitSystem.METRIC,
    };
    this.#geefAfstanden(request, (responses) => {
      callback(responses);
    });
  }

  #geefAfstanden(request, callback) {
    const geocoder = new google.maps.Geocoder();
    const matrixService = new google.maps.DistanceMatrixService();
    const responses = [];
    matrixService.getDistanceMatrix(request).then((response) => {
      const responseList = response.rows[0].elements;
      responseList.forEach((response) => {
        responses.push(response.distance);
      });
      callback(responses);
    });
  }
}
