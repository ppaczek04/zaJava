let map;
let placesMarkers = [];
const selections = {
    foodAndDrink: false,
    culture: false,
    entertainmentAndRecreation: false,
    sport: false,
    busStop: false
};
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
                color: "#C5BAF3",
                position: event.latLng,
                title: markerKey,
                animation: google.maps.Animation.DROP,
                draggable: true,
            });
            markers[markerKey].addListener('dragend', function () {
                console.log(`${markers[markerKey].getTitle()} został przeniesiony na: ${markers[markerKey].getPosition()}`);
                if (markerKey === 'marker1') {
                    document.getElementById('origin').value = markers[markerKey].getPosition();
                }
                if (markerKey === 'marker2') {
                    document.getElementById('destination').value = markers[markerKey].getPosition();
                }
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

    document.getElementById("origAndDestPoints").addEventListener("click", function(){
        if (markers.marker1 && markers.marker2) {
            addRouteToDB(markers.marker1.getPosition(), markers.marker2.getPosition());
        } else {
            alert("Proszę wybrać dwa punkty na mapie.");
        }
        markers.marker1.setDraggable(false);
        markers.marker2.setDraggable(false);
    });

//     document.getElementById("entertainmentAndRecreation").addEventListener('click', async function () {
//         console.log("\n\n\n entertainmentAndRecreation \n\n\n");
//         selections.entertainmentAndRecreation = true;
//         await handleSelection(selections, place);
//         selections.entertainmentAndRecreation = false;
//     });
//
//
//     document.getElementById("foodAndDrink").addEventListener('click', async function () {
//         console.log("\n\n\n foodAndDrink \n\n\n");
//         selections.foodAndDrink = true;
//         await handleSelection(selections, place);
//         selections.foodAndDrink = false;
//     });
//
//
//     document.getElementById("culture").addEventListener('click', async function () {
//         console.log("\n\n\n culture \n\n\n");
//         selections.culture = true;
//         await handleSelection(selections, place);
//         selections.culture = false;
//     });
//
//     document.getElementById("sport").addEventListener('click', async function () {
//         console.log("\n\n\n sport \n\n\n");
//         selections.sport = true;
//         await handleSelection(selections, place);
//         selections.sport = false;
//     });
//
//     document.getElementById("busStop").addEventListener('click', async function () {
//         console.log("\n\n\n busStop \n\n\n");
//         selections.busStop = true;
//         await handleSelection(selections, place);
//         selections.busStop = false;
//     });
// }

document.getElementById("entertainmentAndRecreation").addEventListener('click', () => handleButtonClick('entertainment'));
document.getElementById("foodAndDrink").addEventListener('click', () => handleButtonClick('foodAndDrink'));
document.getElementById("culture").addEventListener('click', () => handleButtonClick('culture'));
document.getElementById("sport").addEventListener('click', () => handleButtonClick('sport'));
document.getElementById("busStop").addEventListener('click', () => handleButtonClick('busStop'));
}

const handleButtonClick = async (key) => {
    console.log("\n\n", selections, "\n\n")
    selections[key] = true;
    console.log("\n\n", selections, "\n\n")
    try {
        await handleSelection(selections, place);
    } catch (error) {
        console.error('Error during handleSelection:', error);
    } finally {
        selections[key] = false;
    }
};


function addMarkers(points) {
    clearPlacesMarkers();

    console.log('POINTS: ', points, "\n");
    points.forEach(point => {
        const position = new google.maps.LatLng(point.latitude, point.longitude);
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: 'Marker'
        });
        placesMarkers.push(marker);
    });
}

function clearPlacesMarkers() {
    placesMarkers.forEach(marker => marker.setMap(null));
    placesMarkers = [];
}

// function handleSelection(selections, place) {
//     console.log('SELECTIONS:', selections, '\n\n\n\n')
//     console.log('JSON to be sent:', JSON.stringify({ selections: selections, place: place }));
//     // Wykonanie zapytania POST do endpointa /processSelections
//     fetch('/processSelections', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             selections: selections,
//             place: place
//         })
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.text(); // Oczekujemy, że serwer zwróci nazwę widoku jako tekst
//         })
//         .then(viewName => {
//             // Obsługa zwróconej nazwy widoku
//             console.log('good\n', points);
//             // Możesz wykonać dodatkowe akcje, np. nawigować do innego widoku
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
// }

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


function addRouteToDB(origin, destination) {
    fetch('/route/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            origin: {
                latitude: origin.lat(),
                longitude: origin.lng()
            },
            destination: {
                latitude: destination.lat(),
                longitude: destination.lng()
            }
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(routeId => {
            console.log('Route ID:', routeId);  // Wyświetla id zapisanej trasy
        })
        .catch(error => console.error('Error saving route points:', error));
}

