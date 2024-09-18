let map;
const selections = {
    foodAndDrink: true,
    culture: false,
    entertainmentAndRecreation: false,
    sport: false,
    busStop: false
};

async function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 13,
        mapId: "ZAJAVA_MAP",
        gestureHandling: "greedy",
    });
    // if(points.length > 0){
    //     addMarkers(points); // czy to coś robi
    // }

    setDefaultRadius(1500);
    document.getElementById('origin').value = "Click on the map";
    document.getElementById('destination').value = "Click on the map";

    // Add listener to create a marker after click
    let markers = addMapListener();
    let routeId;

    // Calculate route and display polyline
    document.getElementById("calculateRouteBtn").addEventListener("click", function () {
        drawPolyline(markers);
    });

    // Actions after confirming origin and destination points
    document.getElementById("origAndDestPoints").addEventListener("click", function () {
        routeId = getRouteId(markers);
        markers.marker1.gmpDraggable = false;
        markers.marker2.gmpDraggable = false;
    });
    // Actions after selection
    document.getElementById("fetchEating").addEventListener('click', async function (event) {
        console.log(selections);
        try {
            place.radius = Math.floor(document.getElementById('radius').value);
            map.setCenter(new google.maps.LatLng(place.latitude, place.longitude));
            map.setZoom(14);
            await handleSelection(selections, place);
        } catch (error) {
            console.error('Error during handleSelection:', error);
        }
    });
}

function setDefaultRadius(radius){ document.getElementById('radius').value = radius; }

function addMapListener(){
    let i = 0;
    let markers = {};
    map.addListener('click', async function (event) {
        if (i < 2) {
            const parser = new DOMParser();
            let pinSvgString;
            if (i < 1) {
                pinSvgString = '<svg width="45px" height="45px" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet"><path d="M49.798 23.592c-7.834.001-15.596 3.368-14.78 10.096l2 14.624c.351 2.573 2.09 6.688 4.687 6.688h.185l2.127 24.531c.092 1.104.892 2 2 2h8c1.108 0 1.908-.896 2-2L58.144 55h.186c2.597 0 4.335-4.115 4.687-6.688l2-14.624c.524-6.734-7.384-10.098-15.219-10.096z" fill="#000000"></path><path d="M50.024 50.908l-.048.126c.016-.038.027-.077.043-.115l.005-.011z" fill="#000000"></path><circle cx="50" cy="10.5" r="10.5" fill="#000000"></circle><path d="M60.922 69.092c-.085.972-.175 1.942-.26 2.914C69.614 73.27 76.25 76.138 77 79.686c1.117 5.276-16.142 7.65-27.26 7.539c-11.118-.112-28.059-2.263-26.578-7.54c.972-3.463 7.512-6.274 16.23-7.583c-.087-.975-.186-1.95-.27-2.924c-11.206 1.236-20.542 4.279-24.272 8.246H2.229L0 82.047h13.166c1.023 5.44 12.427 10.136 28.734 11.322L41.342 100h16.14l-.162-6.63c16.39-1.187 28.117-5.883 29.514-11.323H100l-1.91-4.623H85.469c-3.543-4.067-13.048-7.16-24.547-8.332z" fill="#000000"></path></svg>'; //svgMarkers.originMarker;             // marker for origin
                setNewPlace(event.latLng.lat(), event.latLng.lng());
                document.getElementById('origin').value = await GetAddress(event.latLng.lat(), event.latLng.lng());
            } else {
                pinSvgString = '<svg height="45px" width="45px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n\t viewBox="0 0 512 512" xml:space="preserve">\n<path style="fill:#E2E2E2;" d="M503.916,51.2v102.4v113.179v102.4c0,5.953-4.826,10.779-10.779,10.779h-102.4H277.558H164.379\n\tH16.707V266.779V153.6V40.421h147.672h113.179h113.179h102.4C499.09,40.421,503.916,45.247,503.916,51.2z"/>\n<path style="fill:#002E35;" d="M390.737,153.6H277.558V40.421h113.179V153.6z M40.421,40.421V153.6h123.958V40.421H40.421z\n\t M390.737,153.6v113.179h113.179V153.6H390.737z M164.379,153.6v113.179h113.179V153.6H164.379z M277.558,379.958h113.179V266.779\n\tH277.558V379.958z M40.421,379.958h123.958V266.779H40.421V379.958z"/>\n<path style="fill:#BF4D00;" d="M29.642,503.916L29.642,503.916c-11.906,0-21.558-9.651-21.558-21.558V29.642\n\tc0-11.906,9.651-21.558,21.558-21.558l0,0c11.906,0,21.558,9.651,21.558,21.558v452.716C51.2,494.264,41.549,503.916,29.642,503.916\n\tz"/>\n<path style="fill:#8C1A00;" d="M40.421,501.009c-3.173,1.838-6.848,2.907-10.779,2.907c-11.906,0-21.558-9.651-21.558-21.558V29.642\n\tc0-11.906,9.651-21.558,21.558-21.558c3.931,0,7.606,1.069,10.779,2.907c-6.437,3.73-10.779,10.675-10.779,18.65v452.716\n\tC29.642,490.332,33.984,497.279,40.421,501.009z"/>\n<path d="M493.137,32.337H59.284v-2.695C59.284,13.298,45.986,0,29.642,0S0,13.298,0,29.642v452.716C0,498.702,13.298,512,29.642,512\n\ts29.642-13.298,29.642-29.642v-94.316h433.853c10.401,0,18.863-8.463,18.863-18.863V51.2C512,40.799,503.537,32.337,493.137,32.337z\n\t M43.116,482.358c0,7.43-6.044,13.474-13.474,13.474s-13.474-6.044-13.474-13.474V29.642c0-7.43,6.044-13.474,13.474-13.474\n\ts13.474,6.044,13.474,13.474V482.358z M495.832,369.179c0,1.486-1.208,2.695-2.695,2.695H59.284V48.505h433.853\n\tc1.486,0,2.695,1.208,2.695,2.695V369.179z"/>\n</svg>';//svgMarkers.originMarker;             //marker for destination
                document.getElementById('destination').value = await GetAddress(event.latLng.lat(), event.latLng.lng());
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
            addMarkerListener(markers[markerKey]);
            i += 1;
        }
    });
    return markers;
}

function addMarkerListener(marker){
    marker.addListener('dragend', async function () {
        const position = marker.position;
        console.log(`${marker.title} został przeniesiony na: ${position.lat}, ${position.lng}`);
        if (marker.title === 'marker1') {
            setNewPlace(position.lat,position.lng);
            document.getElementById('origin').value = await GetAddress(position.lat, position.lng);
        }
        if (marker.title === 'marker2') {
            document.getElementById('destination').value = await GetAddress(position.lat, position.lng);
        }
    });
}

function setNewPlace(latitude, longitude){
    place.latitude = latitude;
    place.longitude = longitude;
}

function drawPolyline(markers){
    if (markers.marker1 && markers.marker2) {
        calculateRoute(map, markers.marker1.position, markers.marker2.position);
    } else {
        alert("Proszę wybrać dwa punkty na mapie.");
    }
}

function getRouteId(markers){
    if (markers.marker1 && markers.marker2) {
       return addRouteToDB(markers.marker1.position, markers.marker2.position);
    } else {
        alert("Proszę wybrać dwa punkty na mapie.");
    }
}

function addMarkers(points) {
    let places = {};
    let i = 1;
    addCircle(Math.floor(document.getElementById('radius').value));
    let pinSvgString = '<svg width="40px" height="40px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' + '  <defs>\n' + '    <path id="marker-a" d="M5,2 C4.44771525,2 4,1.55228475 4,1 C4,0.44771525 4.44771525,0 5,0 C5.55228475,0 6,0.44771525 6,1 C6,1.55228475 5.55228475,2 5,2 Z M11.1660156,4.88720703 C11.5270182,4.88753255 11.0398763,6.09019866 9.70458984,8.49520536 C8.36930339,10.9002121 6.80110677,12.8476111 5,14.3374023 C3.47981771,13.1349284 1.89029948,11.2677409 0.231445312,8.73583984 C1.1640625,9.98632812 3.83496094,10.6665039 5.96948242,7.01611328 C7.39249674,4.58251953 9.12467448,3.87288411 11.1660156,4.88720703 Z"/>\n' + '    <path id="marker-c" d="M8,22 C5.23620113,22 0,12.5164513 0,8.162063 C0,3.65933791 3.57653449,0 8,0 C12.4234655,0 16,3.65933791 16,8.162063 C16,12.5164513 10.7637989,22 8,22 Z M8,20 C8.39916438,20 9.97421309,18.1222923 11.3773555,15.5809901 C12.9364167,12.7572955 14,9.79929622 14,8.162063 C14,4.75379174 11.308521,2 8,2 C4.69147901,2 2,4.75379174 2,8.162063 C2,9.79929622 3.06358328,12.7572955 4.62264452,15.5809901 C6.02578691,18.1222923 7.60083562,20 8,20 Z M8,12 C5.790861,12 4,10.209139 4,8 C4,5.790861 5.790861,4 8,4 C10.209139,4 12,5.790861 12,8 C12,10.209139 10.209139,12 8,12 Z M8,10 C9.1045695,10 10,9.1045695 10,8 C10,6.8954305 9.1045695,6 8,6 C6.8954305,6 6,6.8954305 6,8 C6,9.1045695 6.8954305,10 8,10 Z"/>\n' + '  </defs>\n' + '  <g fill="none" fill-rule="evenodd" transform="translate(4 1)">\n' + '    <g transform="translate(3 7)">\n' + '      <mask id="marker-b" fill="#ffffff">\n' + '        <use xlink:href="#marker-a"/>\n' + '      </mask>\n' + '      <use fill="#D8D8D8" xlink:href="#marker-a"/>\n' + '      <g fill="#FFA0A0" mask="url(#marker-b)">\n' + '        <rect width="24" height="24" transform="translate(-7 -8)"/>\n' + '      </g>\n' + '    </g>\n' + '    <mask id="marker-d" fill="#ffffff">\n' + '      <use xlink:href="#marker-c"/>\n' + '    </mask>\n' + '    <use fill="#000000" fill-rule="nonzero" xlink:href="#marker-c"/>\n' + '    <g fill="#7600FF" mask="url(#marker-d)">\n' + '      <rect width="24" height="24" transform="translate(-4 -1)"/>\n' + '    </g>\n' + '  </g>\n' + '</svg>';
    points.forEach(point => {
        const parser = new DOMParser();
        const pinSvg = parser.parseFromString(
            pinSvgString,
            "image/svg+xml"
        ).documentElement;
        const position = new google.maps.LatLng(point.latitude, point.longitude);
        new google.maps.marker.AdvancedMarkerElement({
            map,
            position: position,
            title: 'Marker',
            content: pinSvg
        });
        i += 1;
    });
}

function addCircle(radius){
    const circle = new google.maps.Circle({
        strokeColor: "#86a2c6",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#86a2c6",
        fillOpacity: 0.35,
        map,
        center: new google.maps.LatLng(place.latitude,place.longitude),
        radius: radius,
    });
}

async function handleSelection(selections, place) {
    console.log('SELECTIONS:', selections, '\n\n\n\n');
    try {
        const response = await fetch('/processSelections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selections: selections,
                place: place
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const points = await response.json(); // Oczekujemy, że serwer zwróci listę punktów jako JSON
        console.log('Otrzymane punkty:', points);
        addMarkers(points); // Aktualizuje markery na mapie
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

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
                    strokeColor: "#9E5FC2",
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                });

                intermediatePath.setMap(map);
            } else {
                console.error('No routes found in the response.');
            }
        })
        .catch(error => console.error('Error:', error));
}

function addRouteToDB(origin, destination) {
    let Id;
    fetch('/route/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            origin: {
                latitude: origin.lat,
                longitude: origin.lng,
                name: "origin"
            },
            destination: {
                latitude: destination.lat,
                longitude: destination.lng,
                name: "destination"
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
            Id = routeId;
        })
        .catch(error => console.error('Error saving route points:', error));
    return Id;
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

async function GetAddress(latitude, longitude) {
    try {
        const response = await fetch('/address/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                point: {
                    latitude: latitude,
                    longitude: longitude
                }
            })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}


