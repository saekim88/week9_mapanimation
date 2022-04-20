// L.mapbox.accessToken =
//   "pk.eyJ1Ijoic2Fla2ltIiwiYSI6ImNsMWxxdnJ6bTA2OXczZG1qOGkxZXIxOG0ifQ.MQk25eiDEjYJkd7XOcj1vA";
// var map = L.mapbox
//   .map("map")
//   .setView([42.365554, -71.104081], 12)
//   .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11"));

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2Fla2ltIiwiYSI6ImNsMWxxdnJ6bTA2OXczZG1qOGkxZXIxOG0ifQ.MQk25eiDEjYJkd7XOcj1vA";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-71.104081, 42.365554],
  zoom: 12,
});

let markers = [];
let locations = [];
let routeNo = "";

async function init(route) {
  // reset
  for (i = 0; i < locations.length; i++) {
    markers[i].remove();
  };

  markers = [];
  routeNo = route;

  //get data
  locations = await getBusLocations();

  // locations.length
  for (i = 0; i < locations.length; i++) {
    let popup = new mapboxgl.Popup({ offset: 25, closeButton: false });
    popup.setText(`Route: ${locations[i].attributes.label}`);
    let marker = new mapboxgl.Marker();
    marker.setLngLat([
      locations[i].attributes.longitude,
      locations[i].attributes.latitude,
    ]);
    marker.setPopup(popup);
    markers.push(marker);
    marker.addTo(map);
  }

  run();
}

async function run() {
  // get bus data
  locations = await getBusLocations();

  //   console.log(locations);

  // update bus marker locations
  for (i = 0; i < locations.length; i++) {
    markers[i].setLngLat([
      locations[i].attributes.longitude,
      locations[i].attributes.latitude,
    ]);
    markers[i].getPopup().setText(`Route: ${locations[i].attributes.label}`);
  }

  setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations() {
  const url = "https://api-v3.mbta.com/vehicles";
  const response = await fetch(url);
  const json = await response.json();

  const filter = json.data.filter(
    (data) => data.relationships.route.data.id === routeNo
  );
  console.log(filter);

  return filter;
}

// init(routeNo);

document.getElementById("route60").onclick = function() {init("60")};

document.getElementById("route1").onclick = function() {init("1")};
