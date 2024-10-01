import {getInfoWindowContent, getInfoWindowContentForDestination} from "./JavaScriptFiles/InfoWindowContents.js";
import {getPlacesFromJourney} from "./JavaScriptFiles/LoadingJourneyFunctions.js";
import {setListInLocalStorage, getListFromLocalStorage} from "./JavaScriptFiles/LocalStorage.js";
import {getPinSvgString} from "./JavaScriptFiles/CustomPinsStrings.js";
import {refreshExportLink} from "./JavaScriptFiles/ExportToGMaps.js";
import {renderTripList, renderWaypointsList} from "./JavaScriptFiles/RenderList.js";

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
let routeNumberInJourney = 0;

const entertainmentClickHandler = createClickTypesHandler('entertainment', Place);
const foodAndDrinkClickHandler = createClickTypesHandler('foodAndDrink', Place);
const cultureClickHandler = createClickTypesHandler('culture', Place);
const sportClickHandler = createClickTypesHandler('sport', Place);
const busStopClickHandler = createClickTypesHandler('busStop', Place);

main();
function main(){
    titles = getListFromLocalStorage('savedRoutes');
    console.log(titles);
    renderTripList(titles, SelectedPlaces, routes, polylines, markers, listItems);
    setDefaults(1500);

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
            renderWaypointsList(listItems);
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

function handleSidebarButtons() {
    document.getElementById("entertainmentAndRecreation").addEventListener('click', entertainmentClickHandler);
    document.getElementById("foodAndDrink").addEventListener('click', foodAndDrinkClickHandler);
    document.getElementById("culture").addEventListener('click', cultureClickHandler);
    document.getElementById("sport").addEventListener('click', sportClickHandler);
    document.getElementById("busStop").addEventListener('click', busStopClickHandler);
}

function createClickTypesHandler(eventType, place) {
    return function() {
        handleTypeButtonClick(eventType, place);
    }
}

function setDefaults(radius){
    document.getElementById('radius').value = radius;
    document.getElementById('total-time').textContent = '0';
    document.getElementById('total-distance').textContent = '0';
    document.getElementById('origin').value = "Click on the map";
    document.getElementById('destination').value = "Click on the map";
}

function addMapListener(){
    let i = 0;
    let markers = {};
    map.addListener('click', async function (event) {
        if (i < 2) {
            const parser = new DOMParser();
            let pinSvgString;
            if (i < 1) {
                pinSvgString = getPinSvgString("home");
                setNewPlace(event.latLng.lat(), event.latLng.lng());
                document.getElementById('origin').value = await GetAddress(event.latLng.lat(), event.latLng.lng());
            } else {
                pinSvgString = getPinSvgString("destination");
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
            if( i === 1 ){          // dla markera końcowego (destination)
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
            if(i === 1) {           // dla markera początkowego (home_
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

async function handleTypeButtonClick(key, place){
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


export async function addMarkers(points, info=true) {
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
            setListInLocalStorage('savedRoutes', titles);
            const points = await getPlacesFromJourney(titleText);
            const newPoints = points.map(place => ({
                placeId: place.id,
                latitude: place.latitude,
                longitude: place.longitude
            }));
            refreshExportLink(newPoints);
        });
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
    renderWaypointsList(listItems);
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
                numberInJourney: routeNumberInJourney,
                home: {latitude: origin.lat, longitude: origin.lng},
                destination: {latitude: destination.lat, longitude: destination.lng},
                details: {distance: route.distanceMeters, time: route.duration}
            });
            routeNumberInJourney += 1;

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
        if (response.status === 409 || response.status === 400) {
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
            console.log(response);
        } else {
            const data = await response.json();
            titles.push(title);
            renderTripList(titles, SelectedPlaces, routes, polylines, markers, listItems);
            console.log('Success:', data);
            Swal.fire({
                icon: "success",
                title: "Journey saved successfully!",
                showConfirmButton: false,
                timer: 2400,
            });
            routes =[];
        }
    } catch (error) {
        alert('An unexpected error occurred.');
    }
}

export async function GetAddress(latitude, longitude) {
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
            console.error('Network response was not ok');
        }

        const placeInformation = await response.json();
        console.log('Information:', placeInformation);
        return placeInformation;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}