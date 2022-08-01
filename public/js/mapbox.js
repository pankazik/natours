/* eslint-disable */
export const displayMap = (locations) => {
  let bounds = new L.latLngBounds();
  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
    dragging: false,
    keyboard: false,
    boxZoom: false,
    doubleClickZoom: false,
  }).setView([locations[0].coordinates[1], [locations[0].coordinates[0]]], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 10,
    attribution: '© OpenStreetMap',
  }).addTo(map);

  const createMarker = function (location, i) {
    const latlng = [location.coordinates[1], location.coordinates[0]];
    new L.marker(latlng)
      .addTo(map)
      .bindPopup(
        L.popup({
          autoClose: false,
          closeButon: false,
        }).setContent(`<b>Day ${location.day} : ${location.description}</b>`)
      )
      .openPopup();

    bounds.extend(latlng);
  };

  locations.forEach((el, i) => {
    createMarker(el, i);
  });

  map.fitBounds(bounds.pad(0.5));
};
