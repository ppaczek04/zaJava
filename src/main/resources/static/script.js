let map;
async function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 13,
        mapId: "ZAJAVA_MAP"
    });

    let markers = {};
    let i = 0;

    if (points.length > 0) {
        addMarkers(points);
    }

    map.addListener('click', function (event) {
        if (i < 2) {
            const parser = new DOMParser();
            let pinSvgString;
            if(i < 1){
                pinSvgString ='<svg width="45px" height="45px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet"><path d="M49.798 23.592c-7.834.001-15.596 3.368-14.78 10.096l2 14.624c.351 2.573 2.09 6.688 4.687 6.688h.185l2.127 24.531c.092 1.104.892 2 2 2h8c1.108 0 1.908-.896 2-2L58.144 55h.186c2.597 0 4.335-4.115 4.687-6.688l2-14.624c.524-6.734-7.384-10.098-15.219-10.096z" fill="#000000"></path><path d="M50.024 50.908l-.048.126c.016-.038.027-.077.043-.115l.005-.011z" fill="#000000"></path><circle cx="50" cy="10.5" r="10.5" fill="#000000"></circle><path d="M60.922 69.092c-.085.972-.175 1.942-.26 2.914C69.614 73.27 76.25 76.138 77 79.686c1.117 5.276-16.142 7.65-27.26 7.539c-11.118-.112-28.059-2.263-26.578-7.54c.972-3.463 7.512-6.274 16.23-7.583c-.087-.975-.186-1.95-.27-2.924c-11.206 1.236-20.542 4.279-24.272 8.246H2.229L0 82.047h13.166c1.023 5.44 12.427 10.136 28.734 11.322L41.342 100h16.14l-.162-6.63c16.39-1.187 28.117-5.883 29.514-11.323H100l-1.91-4.623H85.469c-3.543-4.067-13.048-7.16-24.547-8.332z" fill="#000000"></path></svg>'; //svgMarkers.originMarker;             // marker for origin
            }
            else{
                pinSvgString = '<svg height="45px" width="45px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n\t viewBox="0 0 512 512" xml:space="preserve">\n<path style="fill:#E2E2E2;" d="M503.916,51.2v102.4v113.179v102.4c0,5.953-4.826,10.779-10.779,10.779h-102.4H277.558H164.379\n\tH16.707V266.779V153.6V40.421h147.672h113.179h113.179h102.4C499.09,40.421,503.916,45.247,503.916,51.2z"/>\n<path style="fill:#002E35;" d="M390.737,153.6H277.558V40.421h113.179V153.6z M40.421,40.421V153.6h123.958V40.421H40.421z\n\t M390.737,153.6v113.179h113.179V153.6H390.737z M164.379,153.6v113.179h113.179V153.6H164.379z M277.558,379.958h113.179V266.779\n\tH277.558V379.958z M40.421,379.958h123.958V266.779H40.421V379.958z"/>\n<path style="fill:#BF4D00;" d="M29.642,503.916L29.642,503.916c-11.906,0-21.558-9.651-21.558-21.558V29.642\n\tc0-11.906,9.651-21.558,21.558-21.558l0,0c11.906,0,21.558,9.651,21.558,21.558v452.716C51.2,494.264,41.549,503.916,29.642,503.916\n\tz"/>\n<path style="fill:#8C1A00;" d="M40.421,501.009c-3.173,1.838-6.848,2.907-10.779,2.907c-11.906,0-21.558-9.651-21.558-21.558V29.642\n\tc0-11.906,9.651-21.558,21.558-21.558c3.931,0,7.606,1.069,10.779,2.907c-6.437,3.73-10.779,10.675-10.779,18.65v452.716\n\tC29.642,490.332,33.984,497.279,40.421,501.009z"/>\n<path d="M493.137,32.337H59.284v-2.695C59.284,13.298,45.986,0,29.642,0S0,13.298,0,29.642v452.716C0,498.702,13.298,512,29.642,512\n\ts29.642-13.298,29.642-29.642v-94.316h433.853c10.401,0,18.863-8.463,18.863-18.863V51.2C512,40.799,503.537,32.337,493.137,32.337z\n\t M43.116,482.358c0,7.43-6.044,13.474-13.474,13.474s-13.474-6.044-13.474-13.474V29.642c0-7.43,6.044-13.474,13.474-13.474\n\ts13.474,6.044,13.474,13.474V482.358z M495.832,369.179c0,1.486-1.208,2.695-2.695,2.695H59.284V48.505h433.853\n\tc1.486,0,2.695,1.208,2.695,2.695V369.179z"/>\n</svg>';//svgMarkers.originMarker;             //marker for destination
            }
            const pinSvg = parser.parseFromString(
                pinSvgString,
                "image/svg+xml",
            ).documentElement;
            const markerKey = `marker${i + 1}`;
            markers[markerKey] = new google.maps.marker.AdvancedMarkerElement({
                map,
                position: event.latLng,
                title: markerKey,
                content: pinSvg,
                gmpDraggable: true
            });
            markers[markerKey].addListener('dragend', function () {
                const position = markers[markerKey].position;
                console.log(`${markers[markerKey].title} został przeniesiony na: ${position.lat}, ${position.lng}`);
            });
            i += 1;
        }
    });

    // Calculate route and display polyline
    document.getElementById("calculateRouteBtn").addEventListener("click", function () {
        if (markers.marker1 && markers.marker2) {
            calculateRoute(map, markers.marker1.position, markers.marker2.position);
        } else {
            alert("Proszę wybrać dwa punkty na mapie.");
        }
    });

    // Actions after confirming origin and destination points
    document.getElementById("origAndDestPoints").addEventListener("click", function () {
        if (markers.marker1 && markers.marker2) {
            addRouteToDB(markers.marker1.position, markers.marker2.position);
        } else {
            alert("Proszę wybrać dwa punkty na mapie.");
        }
        markers.marker1.gmpDraggable = false;
        markers.marker2.gmpDraggable = false;
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
                    latitude: origin.lat,
                    longitude: origin.lng
                }
            }
        },
        destination: {
            location: {
                latLng: {
                    latitude: destination.lat,
                    longitude: destination.lng
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


function addRouteToDB(origin, destination) {
    fetch('/route/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            origin: {
                latitude: origin.lat,
                longitude: origin.lng
            },
            destination: {
                latitude: destination.lat,
                longitude: destination.lng
            }
        })
    })
        .then(response => {                     // response is an id of a route (for now)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(routeId => {
            console.log('Route ID:', routeId);
        })
        .catch(error => console.error('Error saving route points:', error));
}

// function addLegToDB(origin, destination, polyline) {
//     fetch('/leg/save', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             origin: {
//                 latitude: origin.lat(),
//                 longitude: origin.lng()
//             },
//             destination: {
//                 latitude: destination.lat(),
//                 longitude: destination.lng()
//             },
//             polyline: polyline
//         })
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.text();
//         })
//         .then(routeId => {
//             console.log('Route ID:', legId);  // Wyświetla id zapisanej trasy
//         })
//         .catch(error => console.error('Error saving route points:', error));
// }