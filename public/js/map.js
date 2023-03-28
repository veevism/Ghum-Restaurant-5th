let map;
let marker;
let position = { lat: 18.7991347, lng: 98.9506248 };
let markers = [];
let infoWindow;
let directionsService;
let directionsRenderer;

let allLocation = [
    {
        location: "Ghum restaurant",
        position: {
            lat: 18.7991347,
            lng: 98.9506248
        }
    }
]

const apiKey = "AIzaSyB_w3ntqlpIvJhv8JJDhMMq4wRazbhs1MM";
const address = "95 หมู่.11 แม่กวงใต้ 2/5 สันนาเม็ง สันทราย เชียงใหม่ 50210";

function initMap() {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                const location = data.results[0].geometry.location;

                let obj = {
                    location: "My house",
                    position: {
                        lat: location.lat,
                        lng: location.lng
                    }
                }
                allLocation.push(obj)

                directionsService = new google.maps.DirectionsService();
                directionsRenderer = new google.maps.DirectionsRenderer();

                map = new google.maps.Map(document.getElementById("map"), {
                    center: allLocation[0].position,
                    zoom: 15,
                });

                directionsRenderer.setMap(map);

                const origin = new google.maps.LatLng(allLocation[0].position.lat, allLocation[0].position.lng);
                const destination = new google.maps.LatLng(allLocation[1].position.lat, allLocation[1].position.lng);

                originLatLng = { lat: origin.lat(), lng: origin.lng() }
                destinationLatLng = { lat: destination.lat(), lng: destination.lng() }

                displayRoute(origin, destination);

                infoWindow = new google.maps.InfoWindow();

            } else {
                console.error("Geocoding error:", data.status);
            }
        })
        .catch(error => console.error("Fetch error:", error));

}

function displayRoute(origin, destination) {

    for (i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    const request = {
        origin: origin,
        destination: destination,
        travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsRenderer.setDirections(result);
            const route = result.routes[0];

            console.log(route.legs[0].distance.text);
            console.log(route.legs[0].duration.text);

            // showSteps(result);
        } else {
            console.error("Directions request failed due to " + status);
        }
    });
}