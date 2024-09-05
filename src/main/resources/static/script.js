let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 13
    });
    let markers = {};
    let i = 0;

    if(points.length > 0){
        addMarkers(points);
    }

    map.addListener('click', function (event) {
        if (i < 2) {
            const markerKey = `marker${i + 1}`;
            markers[markerKey] = new google.maps.Marker({
                map: map,
                position: event.latLng,
                title: markerKey,
                animation: google.maps.Animation.DROP,
                draggable: true,
            });
            markers[markerKey].addListener('dragend', function () {
                console.log(`${markers[markerKey].getTitle()} został przeniesiony na: ${markers[markerKey].getPosition()}`);
            });
            i += 1;
        }
    });
    // Calculate route between the markers
    document.getElementById("calculateRouteBtn").addEventListener("click", function() {
        if (markers.marker1 && markers.marker2) {
            calculateRoute(map, markers.marker1.getPosition(), markers.marker2.getPosition());
        } else {
            alert("Proszę wybrać dwa punkty na mapie.");
        }
    });
}

function addMarkers(points) {
    // Można ewentualnie wyczyścić istniejące markery tutaj
    // ...
    console.log(points);
    points.forEach(point => {
        const position = new google.maps.LatLng(point.latitude, point.longitude);
        new google.maps.Marker({
            position: position,
            map: map,
            title: 'Marker'
        });
    });
}

// let btn = document.querySelector('#btn');
// let sidebar = document.querySelector('.sidebar');
//
// btn.onclick = function () {
//     sidebar.classList.toggle('active');
// };
function calculateRoute(map, origin, destination) {
    const requestBody = {
        origin: {
            location: {
                latLng: {
                    latitude: origin.lat(),
                    longitude: origin.lng()
                }
            }
        },
        destination: {
            location: {
                latLng: {
                    latitude: destination.lat(),
                    longitude: destination.lng()
                }
            }
        },
        travelMode: 'DRIVE'
    };


    fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyABfgoEg2PzuIVn-M4myjE1gNesvBHWMHU',
            'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Full response:', data);
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                console.log('Pełna odpowiedź:', data);
                console.log('Odległość:', route.distanceMeters, 'meters');
                console.log('Czas trwania:', route.duration, 'seconds');

                // Decode the polyline
                const path = google.maps.geometry.encoding.decodePath(route.polyline.encodedPolyline);

                // Render the polyline on the map
                const intermediatePath = new google.maps.Polyline({
                    path: path,
                    geodesic: true,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                });

                intermediatePath.setMap(map);
            } else {
                console.error('No routes found in the response.');
            }
        })
        .catch(error => console.error('Error:', error));
}