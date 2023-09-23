mapboxgl.accessToken =
"pk.eyJ1IjoiYW50b25pby1nb256YWxleiIsImEiOiJjbG1qcDhtdTUwNGx6MmxxaTVqN2JnZ3hzIn0.o9Hl5JMImoTtoNoQl0Cs_A";
var map = new mapboxgl.Map({
container: "map",
style: "mapbox://styles/mapbox/streets-v11",
center: [-71.091542, 42.358862],
zoom: 13,
});

var markers = [];


/**
 * Request bus data from MBTA
 * @returns Buses for a specific route
 */
async function getBusLocations() {
    const url =
    "https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip";
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
}

/**
 * Main function
 */
async function run() {
    // get bus data
    const locations = await getBusLocations();
    console.log(new Date());
    console.log(locations);
    // locate each bus and set icon and coordinates
    locations.forEach((bus, i) => {
        var marker = getMarker(bus.id);
        //if marker found just update icon and coordinates
        //if marker not found then create a new marker
        if (marker) {
            moveMarker(marker, bus);
        } else {
            addMarker(bus);
        }
    });

    // timer
    setTimeout(run, 15000);
}

/**
 * Add Marker for the Bus received
 * @param {*} bus 
 */
function addMarker(bus) {
    //get icon according to Bus direction
    var icon = getIcon(bus);
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = `url(${icon})`;
    el.style.width = '33px';
    el.style.height = '36px';
    el.innerHTML="<br><br><strong>Bus " + bus.attributes.label + "</strong>";

    var marker = new mapboxgl.Marker(el)
        .setLngLat([bus.attributes.longitude, bus.attributes.latitude])
        .addTo(map);
    marker.id=bus.id;
    markers.push(marker);
}

/**
 * Get icon for given bus
 * @param {*} bus 
 * @returns icon
 */
function getIcon(bus) {
    // select icon based on bus direction
    if (bus.attributes.direction_id === 0) {
    return "./assets/red.png";
    }
    return "./assets/blue.png";
}

/**
 * Move marker to new coordinates and change icon
 * @param {*} marker 
 * @param {*} bus 
 */
function moveMarker(marker, bus) {
    // change icon if bus has changed direction
    var icon = getIcon(bus);
    marker.getElement().style.backgroundImage = `url(${icon})`;
    marker.getElement().innerHTML="<br><br><strong>Bus " + bus.attributes.label + "</strong>"
    // move icon to new lat/lon
    marker.setLngLat([bus.attributes.longitude, bus.attributes.latitude]);
}

/**
 * Find marker for a given bus ID
 * @param {*} id 
 * @returns marker
 */
function getMarker(id) {
    var marker = markers.find((marker) => marker.id == id);
    return marker;
}

run();