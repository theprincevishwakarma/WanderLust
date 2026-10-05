const map = new mapboxgl.Map({
  accessToken: mapToken,
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

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
      "<p>Exact location will be provided after booking!</p>",
    ),
  )
  .addTo(map);

// const marker = new mapboxgl.Marker({
//   color: "#ef2755",
// })
//   .setLngLat(coordinates)
//   .setPopup(
//     new mapboxgl.Popup({ offset: 25 }).setHTML(
//       "<p>Exact location will be provided after booking!</p>",
//     ),
//   )
//   .addTo(map);
