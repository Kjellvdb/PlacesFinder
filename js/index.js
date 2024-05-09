import Position from "./Position.js";
import PlacesFinder from "./PlacesFinder.js";

async function init() {
  let placesFinder;
  const position = new Position((pos) => {
    new PlacesFinder(pos);
  });
}

window.onload = init();
