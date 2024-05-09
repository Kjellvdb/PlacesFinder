export default class Position {
  constructor(callback) {
    if (navigator.geolocation != null) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        callback(pos);
      });
    } else {
      alert("Locatieservice is niet ondersteund");
    }
  }
}
