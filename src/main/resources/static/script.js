let map;
let placesMarkers = {};
let placesInfoWindows = {};
const selections = {
    foodAndDrink: false,
    culture: false,
    entertainmentAndRecreation: false,
    sport: false,
    busStop: false
};
let mainCircle;
let testCircle;
let listItems = [];
let current_total_time;
let current_total_distance;
let mainMarker;
let SelectedPlaces = {};
let routes = [];
let titles= [];
let markers = {};
let polylines = [];
const entertainmentClickHandler = createClickHandler('entertainment', Place);
const foodAndDrinkClickHandler = createClickHandler('foodAndDrink', Place);
const cultureClickHandler = createClickHandler('culture', Place);
const sportClickHandler = createClickHandler('sport', Place);
const busStopClickHandler = createClickHandler('busStop', Place);

$("#btn").click(function () {
    $(".sidebar").toggleClass('active');
});

$("#btn-new-route").on('click', function() {
    $(this).addClass('clicked');
    console.log(titles);
    setTimeout(function() {
        window.location.reload();
    }, 100);
});

async function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 13,
        mapId: "ZAJAVA_MAP",
        gestureHandling: "greedy",
    });

    titles = getListFromLocalStorage();
    console.log(titles);
    RenderTripList();
    setDefaultRadius(1500);
    document.getElementById('total-time').textContent = '0';
    document.getElementById('total-distance').textContent = '0';
    document.getElementById('origin').value = "Click on the map";
    document.getElementById('destination').value = "Click on the map";

    // Add listener to create a marker after click
    markers = addMapListener();

    document.getElementById("test-radius").addEventListener("mouseover", function(){
        if(testCircle) { testCircle.setMap(null); }
        testCircle = addCircle(Math.floor(document.getElementById('radius').value));
    });
    document.getElementById("test-radius").addEventListener("mouseout", function(){
        if(testCircle) { testCircle.setMap(null); }
    });

    // Actions after confirming origin and destination points
    document.getElementById("submit-origin").addEventListener("click", async function handleClick() {
        document.getElementById("submit-origin").removeEventListener("click", handleClick);
        try {
            const address = await GetAddress(markers.marker1.position.lat, markers.marker1.position.lng);
            listItems.push(address);
            renderList();
            markers.marker1.gmpDraggable = false;
            $('.submit-btn').on('click', function() {
                $(this).addClass('clicked');
            });
        } catch (error) {
            console.log(error);
            document.getElementById("submit-origin").addEventListener("click", handleClick);
        }
    });

    document.getElementById("submit-destination").addEventListener("click", async function handleClick() {
        try {
            if(!markers.marker1.gmpDraggable){
                document.getElementById("submit-destination").removeEventListener("click", handleClick);
                markers.marker2.gmpDraggable = false;
                handleSidebarButtons();
            }
            else{
                Swal.fire({
                    title: "Submit home point first, please",
                    icon: "info"
                });
            }

        } catch (error) {
            console.log(error);
        }
    });
}

function handleSidebarButtons() {
    document.getElementById("entertainmentAndRecreation").addEventListener('click', entertainmentClickHandler);
    document.getElementById("foodAndDrink").addEventListener('click', foodAndDrinkClickHandler);
    document.getElementById("culture").addEventListener('click', cultureClickHandler);
    document.getElementById("sport").addEventListener('click', sportClickHandler);
    document.getElementById("busStop").addEventListener('click', busStopClickHandler);
}

function createClickHandler(eventType, place) {
    return function() {
        handleButtonClick(eventType, place);
    }
}

function setDefaultRadius(radius){
    document.getElementById('radius').value = radius;
}

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
            if( i === 1 ){      // wszystkie akcje poniżej to kopia tego co dzieje się dla innych infowindow
                const position = markers[markerKey].position;
                const response = await calculateDistance(mainMarker.position, {lat: position.lat, lng: position.lng});
                const distance = response.routes[0].distanceMeters;
                placesInfoWindows['destination'] = new google.maps.InfoWindow({
                    content: getInfoWindowContentForDestination(await GetAddress(position.lat, position.lng), distance),
                    maxWidth: 270
                });
                addDestinationMarkerListener(markers[markerKey]);
            }
            i += 1;
            if(i === 1) {
                mainMarker = markers[markerKey];
            }
        }
    });
    return markers;
}

function addDestinationMarkerListener(marker){
    marker.addListener('click', function () {
        closeOtherInfoWindows();
        placesInfoWindows['destination'].open({
            anchor: marker,
            map: map,
        });
        handleMarkerClick('destination', marker);
    });
}

function removeTypesEventListeners(){
    document.getElementById("entertainmentAndRecreation").removeEventListener('click', entertainmentClickHandler);
    document.getElementById("foodAndDrink").removeEventListener('click', foodAndDrinkClickHandler);
    document.getElementById("culture").removeEventListener('click', cultureClickHandler);
    document.getElementById("sport").removeEventListener('click', sportClickHandler);
    document.getElementById("busStop").removeEventListener('click', busStopClickHandler);
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
            const response = await calculateDistance(mainMarker.position, {lat: position.lat, lng: position.lng});
            const distance = response.routes[0].distanceMeters;
            placesInfoWindows['destination'].setContent(
                getInfoWindowContentForDestination(await GetAddress(position.lat, position.lng), distance)
            );

        }
    });
}

function setNewPlace(latitude, longitude){
    Place.latitude = latitude;
    Place.longitude = longitude;
}

async function drawPolyline(markers) {
    const result = await calculateRoute(map, markers.marker1.position, markers.marker2.position);
    if (result) {
        return result;
    } else {
        console.error('Failed to get route data.');
    }

}

async function handleButtonClick(key, place){
    if (place !== undefined) {
        console.log("\n\n", selections, "\n\n")
        selections[key] = true;
        console.log("\n\n", selections, "\n\n")
        try {
            await handleSelection(selections, place);
            map.setCenter(new google.maps.LatLng(place.latitude, place.longitude));
            map.setZoom(14);
        } catch (error) {
            console.error('Error during handleSelection:', error);
        } finally {
            selections[key] = false;
        }
    }
    else {
        console.log("You should choose starting point first")
    }
}


async function addMarkers(points, info=true) {
    clearPlacesMarkers();
    let i = 1;
    let pinSvgString = getPinSvgString("unselected");
    if(mainCircle) { mainCircle.setMap(null); }
    mainCircle = addCircle(Math.floor(document.getElementById('radius').value));

    console.log('POINTS: ', points, "\n");
    for (const point of points) {
        const parser = new DOMParser();
        const pinSvg = parser.parseFromString(
            pinSvgString,
            "image/svg+xml",
        ).documentElement;
        console.log(`\n\n I added place${i}: ${point.placeId} \n\n`)

        const placeKey = `place${i}`;
        placesMarkers[placeKey] = new google.maps.marker.AdvancedMarkerElement({
            position: {lat: point.latitude, lng: point.longitude},
            map: map,
            title: placeKey,
            content: pinSvg
        });

        if(info){
            const placeInformation = await getPlaceInfo(point.placeId);
            const response = await calculateDistance(mainMarker.position, {lat: point.latitude, lng: point.longitude});
            const distance = response.routes[0].distanceMeters;
            console.log("response", distance);

            placesInfoWindows[placeKey] = new google.maps.InfoWindow({
                content: getInfoWindowContent(placeInformation.displayName.text,
                    placeInformation.websiteUri,
                    placeInformation.regularOpeningHours && placeInformation.regularOpeningHours.weekdayDescriptions
                        ? placeInformation.regularOpeningHours.weekdayDescriptions
                        : "None",
                    distance
                ),
                maxWidth: 270
            });
        }


        placesMarkers[placeKey].addListener('click', function () {
            console.log(`Marker ${placeKey} clicked`);
            closeOtherInfoWindows();
            placesInfoWindows[placeKey].open({
                anchor: placesMarkers[placeKey],
                map: map,
            });
            handleMarkerClick(placeKey);
            });
            i += 1;
    }
}

function closeOtherInfoWindows(){
    for(const key in placesInfoWindows) {
        if (placesInfoWindows[key].isOpen) {
            document.getElementById('close-button').click();
        }
    }
}

function handleMarkerClick(placeKey, marker = null) {
        google.maps.event.addListenerOnce(placesInfoWindows[placeKey], 'domready', function () {
        const closeButton = $('#close-button');
        const selectButton = $('#select-button');

        function handleButtonClick(event) {
            if (event.target.id === 'close-button') {
                handleCloseButton(placeKey, selectButton);
            } else if (event.target.id === 'select-button') {
                handleSelectButton(placeKey, marker);
            }
        }
        refreshButtons(closeButton, selectButton, handleButtonClick);
    });
}

function handleCloseButton(placeKey, selectButton) {
    selectButton.off('click');
    placesInfoWindows[placeKey].close();
}

async function handleSelectButton(placeKey, marker = null) {
    let result, position, address;
    if (placeKey === 'destination') {
        removeTypesEventListeners();
        position = marker.position;
        clearPlacesMarkers();
        result = await drawPolyline({
            marker1: mainMarker,
            marker2: marker
        });
        $('#save').on('click', async function () {
            const titleElement = document.getElementById('editable-title');
            const titleText = titleElement.textContent;
            await addJourneyToDatabase(titleText, routes);
            localStorage.setItem('savedRoutes', JSON.stringify(titles));
        });

        // document.getElementById("link").addEventListener("click", async function () {
        //     const journeyCoords = getCoords(); // dopisać funkcję i endpoint do pobrania punktów trasy, chyba że jest jakiś inny sposób
        //     const link = generateGoogleMapsLink(journeyCoords);
        //     console.log("Link do Google Maps:", link);
        //     window.open(link, "_blank");
        // });
    }
    else{
        console.log('Select button clicked!');
        position = placesMarkers[placeKey].position;
        placesMarkers[placeKey].map = null;
        let pinSvgStringSelected = getPinSvgString("selected");
        const parser = new DOMParser();
        const pinSvg = parser.parseFromString(
            pinSvgStringSelected,
            "image/svg+xml",
        ).documentElement;

        SelectedPlaces[placeKey] = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: {lat: position.lat, lng: position.lng},
            content: pinSvg,
        });
        result = await drawPolyline({marker1: mainMarker, marker2: SelectedPlaces[placeKey]});
        mainMarker = SelectedPlaces[placeKey];
    }
    address = await GetAddress(position.lat, position.lng);
    setNewPlace(position.lat, position.lng);
    console.log(escapeBackslashes(result.polyline));
    if (mainCircle) { mainCircle.setMap(null); }
    listItems.push(address);
    renderList();
    updateDistanceAndTime(result);
}

function escapeBackslashes(inputString) {
    return inputString.replace(/\\/g, "\\\\");
}
function clearPlacesMarkers() {
    for (const key in placesMarkers) {
        placesMarkers[key].map = null;
        delete placesMarkers[key];
    }
}

function refreshButtons(closeButton, selectButton, functionName){
    closeButton.off('click');
    selectButton.off('click');
    closeButton.on('click', functionName);
    selectButton.on('click', functionName);
}

function updateDistanceAndTime(result){
    current_total_time = parseInt(document.getElementById('total-time').textContent, 10);
    current_total_time += Math.round(parseInt(result.time) / 60);
    document.getElementById('total-time').textContent = current_total_time;
    current_total_distance = parseInt(document.getElementById('total-distance').textContent, 10);
    current_total_distance += result.distance;
    document.getElementById('total-distance').textContent = current_total_distance;
}

function addCircle(radius){
    return new google.maps.Circle({
        strokeColor: "#86a2c6",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#86a2c6",
        fillOpacity: 0.35,
        map,
        center: new google.maps.LatLng(Place.latitude, Place.longitude),
        radius: radius,
    });
}

async function handleSelection(selections, place) {
    if(mainMarker) {
        setNewPlace(mainMarker.position.lat, mainMarker.position.lng)
    }
    console.log('SELECTIONS:', selections, '\n\n\n\n');
    place.radius = Math.floor(document.getElementById('radius').value);
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

        const points = await response.json();
        console.log('Otrzymane punkty:', points);
        await addMarkers(points);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function calculateRoute(map, origin, destination) {
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
        travelMode: 'WALK'
    };


    try {
        const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': 'AIzaSyABfgoEg2PzuIVn-M4myjE1gNesvBHWMHU',
                'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        console.log('Full response:', data);

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
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

            intermediatePath.addListener('mouseover', () => {
                intermediatePath.setOptions({ strokeColor: '#00FF00' });
            });
            intermediatePath.addListener('mouseout', () => {
                intermediatePath.setOptions({ strokeColor: '#9E5FC2' });
            });

            intermediatePath.setMap(map);
            polylines.push(intermediatePath);
            routes.push({
                polyline: route.polyline.encodedPolyline,
                home: {latitude: origin.lat, longitude: origin.lng},
                destination: {latitude: destination.lat, longitude: destination.lng},
                details: {distance: route.distanceMeters, time: route.duration}
            })


            return {
                polyline: route.polyline.encodedPolyline,
                distance: route.distanceMeters,
                time: route.duration
            };
        } else {
            console.error('No routes found in the response.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function calculateDistance(origin, destination) {
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
        travelMode: 'WALK'
    };


    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': 'AIzaSyABfgoEg2PzuIVn-M4myjE1gNesvBHWMHU',
            'X-Goog-FieldMask': 'routes.distanceMeters'
        },
        body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
    throw new Error('Network response was not ok');
    }

    const distance = await response.json();
    console.log('Information: ', distance);
    return distance;
}

// routes(home, destination, polyline, details) <- ma takie cos
async function addJourneyToDatabase(title, routes){
    const requestBody = {
        "title": title,
        "routes": routes
    }

    try {
        const response = await fetch('/journey/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        if (response.status === 409) {
            Swal.fire({
                title: "Duplicate!",
                text: "Journey title already exists",
                icon: "warning"
            });
        } else if (!response.ok) {
            Swal.fire({
                title: "Error",
                text: "Please try again",
                icon: "error"
            });
        } else {
            const data = await response.json();
            titles.push(title);
            RenderTripList();
            console.log('Success:', data);
            Swal.fire({
                icon: "success",
                title: "Journey saved successfully!",
                showConfirmButton: false,
                timer: 2400,
            });
        }
    } catch (error) {
        alert('An unexpected error occurred.');
    }
}

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
        return removeLocationCode(await response.text());
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}
function removeLocationCode(str) {
    const pattern = /^[A-Z0-9]{4}\+[A-Z0-9]{2}\s*/;
    return str.replace(pattern, '');
}

async function getPlaceInfo(placeId) {
    try {
        const response = await fetch('/places/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(placeId)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const placeInformation = await response.json();
        console.log('Information:', placeInformation);
        return placeInformation;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

function getInfoWindowContent(placeName, information, openingHours, distance) {
    return `
                <head>
                    <title>info-window</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css" rel="stylesheet">
                </head>
                <body>
                <div style="
                                padding: 10px;
                              ">
                    <style>
                        .gm-style-iw-chr {display: none;}
                        .info-window { padding: 10px; }
                        .info-header { display: flex; justify-content: space-between; align-items: center; }
                        .info-place { display: flex; align-items: center; }
                        .bi-geo-alt-fill { margin-right: 8px; color: #7600FF}
                        .info-distance { color: gray; margin-left: 20px}
                        .info-details { margin-top: 10px; max-width: 230px; /*overflow-x: auto; white-space: nowrap;*/}
                        .info-hours { margin-top: 10px; color: gray; }
                        .info-hours span { display: block;}
                        .info-buttons { margin-top: 10px; display: flex; justify-content: space-between; }
                        .button {background-color: #7600FF; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 14px; cursor: pointer; transition: background-color 0.3s ease, transform 0.3s ease;}
                        .button:hover {background-color: #5700CC; transform: scale(1.1);}
                    </style>
                
                    <div class="info-window">
                        <div class="info-header">
                            <div class="info-place">
                                <i class="bi bi-geo-alt-fill"></i>
                                <div><strong>${placeName}</strong></div>
                            </div>
                            <div class="info-distance">${distance}m</div>
                        </div>
                
                        <div class="info-details">
                            <a href="${information? information: ""}" target="_blank">${information ? information: "No website"}</a>
                        </div>
                        
                        <div class="info-hours">
                            <strong>Opening hours:</strong><br>
                            ${openingHours !== "None" ? `
                                <span>${openingHours[0]}</span>
                                <span>${openingHours[1]}</span>
                                <span>${openingHours[2]}</span>
                                <span>${openingHours[3]}</span>
                                <span>${openingHours[4]}</span>
                                <span>${openingHours[5]}</span>
                                <span>${openingHours[6]}</span>
                            ` : "None"}
                        </div>
                        
                        <div class="info-buttons">
                            <button class="button" id="close-button">Close</button>
                            <button class="button" id="select-button">Select</button>
                        </div>
                    </div>
                </div>
                </body>
            `
}

function renderList() {
    const list = document.getElementById('dynamic-list');
    list.innerHTML = '';
    listItems.forEach(item => {
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.textContent = item;
        li.appendChild(p);
        list.appendChild(li);
    });
}

function RenderTripList() {
    const list = document.getElementById('saved-routes');
    list.innerHTML = '';
    titles.forEach(item => {
        const li = document.createElement('li');
        //const p = document.createElement('p');
        //p.textContent = item;
        const button = document.createElement('button');
        button.classList.add('btn-trips');
        button.textContent = item;
        button.addEventListener('click', async function () {
            await clearMap();
            let newPoints = await getPlacesFromJourney(item);
            map.setCenter(new google.maps.LatLng(newPoints[0].latitude, newPoints[0].longitude));
            document.getElementById('total-time').textContent = '0';
            document.getElementById('total-distance').textContent = '0';
            document.getElementById('editable-title').contentEditable = false;
            document.getElementById('editable-title').textContent = item;
            document.getElementById('origin').value =await GetAddress(newPoints[0].latitude, newPoints[0].longitude);
            document.getElementById('destination').value = await GetAddress(newPoints[newPoints.length - 1].latitude, newPoints[newPoints.length - 1].longitude);
            getJourney(item);
        });
        //li.appendChild(p);
        li.appendChild(button);
        list.appendChild(li);
    });
}

function clearMap(){
    Object.values(SelectedPlaces).forEach(item => {
        item.map = null;
    });
    SelectedPlaces = {};
    Object.values(markers).forEach(item => {
        item.map = null;
    });
    markers = {};
    polylines.forEach(polyline => {
       polyline.setMap(null);
    });
    polylines = [];
    listItems = [];
    renderList();
}

function generateGoogleMapsLink(points, travelMode = "walking") {
    if (points.length < 2) {
        throw new Error("Musisz podać co najmniej dwa punkty: początkowy i końcowy.");
    }

    const origin = `${points[0][0]},${points[0][1]}`;
    const destination = `${points[points.length - 1][0]},${points[points.length - 1][1]}`;

    let waypointsParam = "";
    if (points.length > 2) {
        const waypoints = points.slice(1, points.length - 1)
            .map(point => `${point[0]},${point[1]}`)
            .join('|');
        waypointsParam = `&waypoints=${waypoints}`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=${travelMode}`;
}

function getPinSvgString(type) {
    if(type === "unselected"){
        return '<svg width="45px" height="45px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' + '  <defs>\n' + '    <path id="marker-a" d="M5,2 C4.44771525,2 4,1.55228475 4,1 C4,0.44771525 4.44771525,0 5,0 C5.55228475,0 6,0.44771525 6,1 C6,1.55228475 5.55228475,2 5,2 Z M11.1660156,4.88720703 C11.5270182,4.88753255 11.0398763,6.09019866 9.70458984,8.49520536 C8.36930339,10.9002121 6.80110677,12.8476111 5,14.3374023 C3.47981771,13.1349284 1.89029948,11.2677409 0.231445312,8.73583984 C1.1640625,9.98632812 3.83496094,10.6665039 5.96948242,7.01611328 C7.39249674,4.58251953 9.12467448,3.87288411 11.1660156,4.88720703 Z"/>\n' + '    <path id="marker-c" d="M8,22 C5.23620113,22 0,12.5164513 0,8.162063 C0,3.65933791 3.57653449,0 8,0 C12.4234655,0 16,3.65933791 16,8.162063 C16,12.5164513 10.7637989,22 8,22 Z M8,20 C8.39916438,20 9.97421309,18.1222923 11.3773555,15.5809901 C12.9364167,12.7572955 14,9.79929622 14,8.162063 C14,4.75379174 11.308521,2 8,2 C4.69147901,2 2,4.75379174 2,8.162063 C2,9.79929622 3.06358328,12.7572955 4.62264452,15.5809901 C6.02578691,18.1222923 7.60083562,20 8,20 Z M8,12 C5.790861,12 4,10.209139 4,8 C4,5.790861 5.790861,4 8,4 C10.209139,4 12,5.790861 12,8 C12,10.209139 10.209139,12 8,12 Z M8,10 C9.1045695,10 10,9.1045695 10,8 C10,6.8954305 9.1045695,6 8,6 C6.8954305,6 6,6.8954305 6,8 C6,9.1045695 6.8954305,10 8,10 Z"/>\n' + '  </defs>\n' + '  <g fill="none" fill-rule="evenodd" transform="translate(4 1)">\n' + '    <g transform="translate(3 7)">\n' + '      <mask id="marker-b" fill="#ffffff">\n' + '        <use xlink:href="#marker-a"/>\n' + '      </mask>\n' + '      <use fill="#D8D8D8" xlink:href="#marker-a"/>\n' + '      <g fill="#FFA0A0" mask="url(#marker-b)">\n' + '        <rect width="24" height="24" transform="translate(-7 -8)"/>\n' + '      </g>\n' + '    </g>\n' + '    <mask id="marker-d" fill="#ffffff">\n' + '      <use xlink:href="#marker-c"/>\n' + '    </mask>\n' + '    <use fill="#000000" fill-rule="nonzero" xlink:href="#marker-c"/>\n' + '    <g fill="#7600FF" mask="url(#marker-d)">\n' + '      <rect width="24" height="24" transform="translate(-4 -1)"/>\n' + '    </g>\n' + '  </g>\n' + '</svg>';
    }
    else if(type === "selected") {
        return '<svg width="45px" height="45px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n' + '  <defs>\n' + '    <path id="marker-a" d="M5,2 C4.44771525,2 4,1.55228475 4,1 C4,0.44771525 4.44771525,0 5,0 C5.55228475,0 6,0.44771525 6,1 C6,1.55228475 5.55228475,2 5,2 Z M11.1660156,4.88720703 C11.5270182,4.88753255 11.0398763,6.09019866 9.70458984,8.49520536 C8.36930339,10.9002121 6.80110677,12.8476111 5,14.3374023 C3.47981771,13.1349284 1.89029948,11.2677409 0.231445312,8.73583984 C1.1640625,9.98632812 3.83496094,10.6665039 5.96948242,7.01611328 C7.39249674,4.58251953 9.12467448,3.87288411 11.1660156,4.88720703 Z"/>\n' + '    <path id="marker-c" d="M8,22 C5.23620113,22 0,12.5164513 0,8.162063 C0,3.65933791 3.57653449,0 8,0 C12.4234655,0 16,3.65933791 16,8.162063 C16,12.5164513 10.7637989,22 8,22 Z M8,20 C8.39916438,20 9.97421309,18.1222923 11.3773555,15.5809901 C12.9364167,12.7572955 14,9.79929622 14,8.162063 C14,4.75379174 11.308521,2 8,2 C4.69147901,2 2,4.75379174 2,8.162063 C2,9.79929622 3.06358328,12.7572955 4.62264452,15.5809901 C6.02578691,18.1222923 7.60083562,20 8,20 Z M8,12 C5.790861,12 4,10.209139 4,8 C4,5.790861 5.790861,4 8,4 C10.209139,4 12,5.790861 12,8 C12,10.209139 10.209139,12 8,12 Z M8,10 C9.1045695,10 10,9.1045695 10,8 C10,6.8954305 9.1045695,6 8,6 C6.8954305,6 6,6.8954305 6,8 C6,9.1045695 6.8954305,10 8,10 Z"/>\n' + '  </defs>\n' + '  <g fill="none" fill-rule="evenodd" transform="translate(4 1)">\n' + '    <g transform="translate(3 7)">\n' + '      <mask id="marker-b" fill="#ffffff">\n' + '        <use xlink:href="#marker-a"/>\n' + '      </mask>\n' + '      <use fill="#D8D8D8" xlink:href="#marker-a"/>\n' + '      <g fill="#FFA0A0" mask="url(#marker-b)">\n' + '        <rect width="24" height="24" transform="translate(-7 -8)"/>\n' + '      </g>\n' + '    </g>\n' + '    <mask id="marker-d" fill="#ffffff">\n' + '      <use xlink:href="#marker-c"/>\n' + '    </mask>\n' + '    <use fill="#000000" fill-rule="nonzero" xlink:href="#marker-c"/>\n' + '    <g fill="#FFFF00" mask="url(#marker-d)">\n' + '      <rect width="24" height="24" transform="translate(-4 -1)"/>\n' + '    </g>\n' + '  </g>\n' + '</svg>';
    }
}

function getInfoWindowContentForDestination(placeName,distance) {
    return `<head>
                    <title>info-window</title>
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css" rel="stylesheet">
                </head>
                <body>
                <div style="
                                padding: 10px;
                              ">
                    <style>
                        .gm-style-iw-chr {display: none;}
                        .info-window { padding: 10px; }
                        .info-header { display: flex; justify-content: space-between; align-items: center; }
                        .info-place { display: flex; align-items: center; }
                        .bi-geo-alt-fill { margin-right: 8px; color: #7600FF}
                        .info-distance { color: gray; margin-left: 20px}
                        .info-buttons { margin-top: 50px; display: flex; justify-content: space-between; }
                        .button {background-color: #7600FF; color: white; border: none; padding: 5px 10px; border-radius: 5px; font-size: 14px; cursor: pointer; transition: background-color 0.3s ease, transform 0.3s ease;}
                        .select-button { margin-left: 10px; }
                        .button:hover {background-color: #5700CC; transform: scale(1.1);}
                    </style>
                
                    <div class="info-window">
                        <div class="info-header">
                            <div class="info-place">
                                <i class="bi bi-geo-alt-fill"></i>
                                <div><strong>${placeName}</strong></div>
                            </div>
                            <div class="info-distance">${distance}m</div>
                        </div>
                      
                        <div class="info-buttons">
                            <button class="button" id="close-button">Close</button>
                            <button class="button" id="select-button">Select and finish</button>
                        </div>
                    </div>
                </div>
                </body>
            `
}

async function getJourney(title){

    const points = await getPlacesFromJourney(title);
    const polylines = await getPolylinesFromJourney(title);
    const new_points = points.map(place => ({
        placeId: place.id,
        latitude: place.latitude,
        longitude: place.longitude
    }));

    await drawPolylines(polylines);
    await addMarkers(new_points, false);
}

async function getPlacesFromJourney(journeyTitle) {
    try {
        const response = await fetch('/journey/get/places', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: journeyTitle})
        });

        if (!response.ok) {
            console.error('Response status:', response.status); // Loguje kod statusu
            const errorBody = await response.text(); // Odczytuje treść odpowiedzi
            console.error('Response body:', errorBody); // Loguje treść odpowiedzi
            throw new Error('Network response was not ok');
        }

        const points = await response.json();
        console.log('Information:', points);
        return points;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

async function getPolylinesFromJourney(journeyTitle) {
    try {
        const response = await fetch('/journey/get/polylines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: journeyTitle})
        });

        if (!response.ok) {
            console.error('Response status:', response.status); // Loguje kod statusu
            const errorBody = await response.text(); // Odczytuje treść odpowiedzi
            console.error('Response body:', errorBody); // Loguje treść odpowiedzi
            throw new Error('Network response was not ok');
        }

        const polylines = await response.json();
        console.log('Information:', polylines);
        return polylines;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

async function drawPolyline2(polyline) {
    const path = google.maps.geometry.encoding.decodePath(polyline);

    // Render the polyline on the map
    const intermediatePath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#9E5FC2",
        strokeOpacity: 1.0,
        strokeWeight: 5,
    });

    intermediatePath.addListener('mouseover', () => {
        intermediatePath.setOptions({ strokeColor: '#00FF00' });
    });
    intermediatePath.addListener('mouseout', () => {
        intermediatePath.setOptions({ strokeColor: '#9E5FC2' });
    });

    intermediatePath.setMap(map);
}

async function drawPolylines(polylines) {
    for (const polyline of polylines) {
        await drawPolyline2(polyline);
    }
}
function getListFromLocalStorage() {
    const savedList = localStorage.getItem('savedRoutes');
    return savedList ? JSON.parse(savedList) : [];
}