const map = new mapboxgl.Map({
  accessToken: mapToken,
  container: "map", // container ID
  center: [77.06971, 28.679079], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});
