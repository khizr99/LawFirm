mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12', // style URL 
center: lawfirm.geometry.coordinates, // starting position [lng, lat]
zoom: 4, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(lawfirm.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25})
        .setHTML(
            `<h5>${lawfirm.location}</h5><p>${lawfirm.name}</p>`
        )
    )
    .addTo(map);