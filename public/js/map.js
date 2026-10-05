const map = new mapboxgl.Map({
  accessToken: mapToken,
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.FullscreenControl());
map.addControl(new mapboxgl.NavigationControl());

const markerElement = document.createElement("div");

markerElement.className = "staynest-marker";

markerElement.innerHTML = `
  <i class="fa-solid fa-house home-icon"></i>
  <img src="https://res.cloudinary.com/frtasp0i/image/upload/v1789910962/StayNest-logo.svg" class="staynest-logo" alt="StayNest">
`;

const marker = new mapboxgl.Marker({
  element: markerElement,
})
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 1 }).setHTML(
      `<p class="popup">You'll be living here!</p>`,
    ),
  )
  .addTo(map);
