import Map from "./Map.js";
import Marker from "./Marker.js";
import Matrix from "./Matrix.js";
import Route from "./Route.js";

export default class PlacesFinder {
  #googleMap;
  #currentPos;
  #marker;

  constructor(pos) {
    this.#currentPos = pos;
    this.#googleMap = new Map(this.#currentPos).map;
    this.#marker = new Marker(this.#currentPos, this.#googleMap);
    this.#setSubmitListener();
    this.#setAutocomplete(this.#currentPos);
  }

  #setAutocomplete(pos) {
    new google.maps.places.Autocomplete(document.getElementById("gebouw"), {
      types: ["establishment"],
      componentRestrictions: { country: ["BE"] },
      fields: ["place_id", "address_components", "geometry", "name"],
      bounds: {
        north: pos.lat + 0.01,
        south: pos.lat - 0.01,
        east: pos.lng + 0.01,
        west: pos.lng - 0.01,
      },
      strictBounds: false,
    });
  }

  #setSubmitListener() {
    window.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submit").click();
      }
    });
    document.getElementById("submit").addEventListener("click", () => {
      let vervoersmiddel = document.getElementById("vervoersmiddel").value;
      if (!Boolean(vervoersmiddel)) vervoersmiddel = "4";
      let gebouw = document.getElementById("gebouw").value;
      if (!Boolean(gebouw)) gebouw = "Universiteit Gent - Complex Plateau";
      this.#findPlaces(gebouw, vervoersmiddel);
    });
  }

  #findPlaces(gebouw, vervoersmiddel) {
    let request = {
      location: this.#currentPos,
      rankBy: google.maps.places.RankBy.DISTANCE,
      keyword: gebouw,
    };
    let service = new google.maps.places.PlacesService(this.#googleMap);
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.#marker.hide();
        document.getElementById("menu").style.display = "none";
        switch (results.length) {
          case 0:
            alert("Geen resultaten gevonden.");
            break;
          default:
            this.#maakOverzicht(results, vervoersmiddel);
            break;
        }
      }
    });
  }

  async #maakOverzicht(results, vervoersmiddel) {
    const infoPane = document.getElementById("panel");
    while (infoPane.firstChild) infoPane.removeChild(infoPane.firstChild);
    if (results.length === 1) {
      infoPane.style.setProperty("grid-template-columns", "1fr");
    }
    const afstanden = await new Promise((resolve) => {
      this.#vraagMatrix(results, vervoersmiddel, (response) => {
        resolve(response);
      });
    });
    results.forEach((placeDetails, index) => {
      placeDetails.afstand = afstanden[index];
    });
    results.sort((a, b) => a.afstand.value - b.afstand.value);
    results.forEach((placeDetails) => {
      const {
        photos,
        name: placeName,
        rating: placeRating,
        afstand,
        opening_hours: openingHours,
        geometry: bestemmingFuncties,
      } = placeDetails;
      const bestemming = {
        lat: bestemmingFuncties.location.lat(),
        lng: bestemmingFuncties.location.lng(),
      };
      const place = document.createElement("article");
      const photo = document.createElement("img");
      const name = document.createElement("p");
      const ratingAndDistance = document.createElement("section");
      const rating = document.createElement("p");
      const distance = document.createElement("p");
      if (
        photos != undefined &&
        placeName != undefined &&
        rating != undefined &&
        openingHours != undefined &&
        openingHours.isOpen
      ) {
        photo.src = photos[0].getUrl();
        photo.style.setProperty("width", "100%");
        place.appendChild(photo);
        name.innerHTML = placeName;
        place.appendChild(name);
        rating.innerHTML = `Rating: ${placeRating} \u272e`;
        ratingAndDistance.appendChild(rating);
        distance.innerHTML = `${
          afstand.value < 1000 ? afstand.value + " m" : afstand.text
        }`;
        ratingAndDistance.appendChild(distance);
        place.appendChild(ratingAndDistance);
        place.style.setProperty("display", "block");
        place.style.setProperty("margin", "auto");
        const service = new google.maps.places.PlacesService(this.#googleMap);
        const request = {
          placeId: placeDetails.place_id,
          fields: ["international_phone_number", "website", "reviews"],
        };
        service.getDetails(request, (placeDetailsExtra) => {
          const {
            international_phone_number: phoneNumber,
            website,
            reviews,
          } = placeDetailsExtra;
          const phone = document.createElement("p");
          const websiteLink = document.createElement("a");
          const websiteBlock = document.createElement("p");
          const reviewLink = document.createElement("a");
          const reviewBlock = document.createElement("p");
          phone.innerHTML = "Telefoonnummer onbeschikbaar";
          if (phoneNumber != undefined) {
            phone.innerHTML = `\u260f ${phoneNumber} `;
          }
          place.appendChild(phone);
          websiteLink.innerHTML = "Website onbeschikbaar";
          websiteLink.href = "#";
          if (website != undefined) {
            websiteLink.innerHTML = "Bezoek hun website";
            websiteLink.href = website;
          }
          websiteBlock.appendChild(websiteLink);
          place.appendChild(websiteBlock);
          reviewLink.innerHTML = "Reviews onbeschikbaar";
          reviewLink.href = "#";
          if (reviews != undefined) {
            reviewLink.innerHTML = "Bekijk de reviews";
            reviewLink.addEventListener("click", () => {
              this.#toonReviews(reviews, results, vervoersmiddel);
            });
          }
          reviewBlock.appendChild(reviewLink);
          place.appendChild(reviewBlock);
          const route = document.createElement("button");
          route.innerHTML = "Ga naar hier";
          route.addEventListener("click", () => {
            infoPane.style.visibility = "hidden";
            this.#marker.hide();
            this.#maakRoute(bestemming, vervoersmiddel);
          });
          place.appendChild(route);
        });
        infoPane.appendChild(place);
      }
    });
    infoPane.style.visibility = "visible";
  }

  #vraagMatrix(results, vervoersmiddel, callback) {
    new Matrix(results, vervoersmiddel).berekenAfstand(
      this.#currentPos,
      (response) => {
        callback(response);
      }
    );
  }

  #maakRoute(bestemming, vervoersmiddel) {
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressBicyclingLayer: true,
    });
    directionsRenderer.setPanel(document.getElementById("sidebar"));
    directionsRenderer.setMap(this.#googleMap);

    const sidebar = document.getElementById("sidebar");
    sidebar.style.visibility = "visible";
    sidebar.innerHTML = "";
    const route = new Route(
      this.#googleMap,
      this.#currentPos,
      bestemming,
      vervoersmiddel,
      directionsRenderer
    );
    route.toonRoute();
    document.getElementsByClassName(".warnbox-content").innerHTML = "";
  }

  #toonReviews(reviews, results, vervoersmiddel) {
    const infoPane = document.getElementById("panel");
    while (infoPane.firstChild) infoPane.removeChild(infoPane.firstChild);
    infoPane.style.setProperty("grid-template-columns", "repeat(5, 1fr)");
    infoPane.style.setProperty("grid-template-rows", "auto 1fr");
    reviews.forEach((review) => {
      const reviewBlock = document.createElement("article");
      const reviewHeader = document.createElement("h1");
      const reviewText = document.createElement("p");
      const reviewTime = document.createElement("p");
      reviewHeader.innerHTML = `${review.author_name}: ${review.rating} \u272e`;
      reviewBlock.appendChild(reviewHeader);
      reviewText.innerHTML = review.text;
      reviewBlock.appendChild(reviewText);
      reviewTime.innerHTML = `Ongeveer ${review.relative_time_description}`;
      reviewBlock.appendChild(reviewTime);
      infoPane.appendChild(reviewBlock);
    });
    const button = document.createElement("button");
    const buttonBlock = document.createElement("p");
    button.innerHTML = "Terug";
    button.addEventListener("click", () => {
      this.#maakOverzicht(results, vervoersmiddel);
    });
    button.style.setProperty("width", "250px");
    buttonBlock.appendChild(button);
    buttonBlock.style.setProperty("grid-column", "span 5");
    buttonBlock.style.setProperty("text-align", "center");
    infoPane.appendChild(buttonBlock);

    /*
          if (placeDetails.reviews != undefined) {
            if (placeDetails.reviews[0] != undefined) {
              let revtit1 = document.createElement("p");
              revtit1.textContent = "Review 1:";
              infoPane.appendChild(revtit1);
              let review1 = document.createElement("p");
              let revname1 = document.createElement("p");
              let revtext1 = document.createElement("p");
              let revtime1 = document.createElement("p");
              revname = placeDetails.reviews[0].author_name;
              revrat = `${placeDetails.reviews[0].rating} \u272e`;
              revtext1.textContent = placeDetails.reviews[0].text;
              revtime = placeDetails.reviews[0].relative_time_description;
              revname1.textContent = revname + ": " + revrat;
              revtime1.textContent = "Ongeveer " + revtime;
              review1.appendChild(revname1);
              review1.appendChild(revtext1);
              review1.appendChild(revtime1);
              infoPane.appendChild(review1);
            }
            if (placeDetails.reviews[1] != undefined) {
              let revtit2 = document.createElement("p");
              revtit2.textContent = "Review 2:";
              infoPane.appendChild(revtit2);
              let review2 = document.createElement("p");
              let revname2 = document.createElement("p");
              let revtext2 = document.createElement("p");
              let revtime2 = document.createElement("p");
              revname = placeDetails.reviews[1].author_name;
              revrat = `${placeDetails.reviews[1].rating} \u272e`;
              revtext2.textContent = placeDetails.reviews[1].text;
              revtime = placeDetails.reviews[1].relative_time_description;
              revname2.textContent = revname + ": " + revrat;
              revtime2.textContent = "Ongeveer " + revtime;
              review2.appendChild(revname2);
              review2.appendChild(revtext2);
              review2.appendChild(revtime2);
              infoPane.appendChild(review2);
            }
            if (placeDetails.reviews[2] != undefined) {
              let revtit3 = document.createElement("p");
              revtit3.textContent = "Review 3:";
              infoPane.appendChild(revtit3);
              let review3 = document.createElement("p");
              let revname3 = document.createElement("p");
              let revtext3 = document.createElement("p");
              let revtime3 = document.createElement("p");
              revname = placeDetails.reviews[2].author_name;
              revrat = `${placeDetails.reviews[2].rating} \u272e`;
              revtext3.textContent = placeDetails.reviews[2].text;
              revtime = placeDetails.reviews[2].relative_time_description;
              revname3.textContent = revname + ": " + revrat;
              revtime3.textContent = "Ongeveer " + revtime;
              review3.appendChild(revname3);
              review3.appendChild(revtext3);
              review3.appendChild(revtime3);
              infoPane.appendChild(review3);
            }
          }
          */
  }
}
