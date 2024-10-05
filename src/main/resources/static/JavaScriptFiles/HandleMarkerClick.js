import {removeTypesEventListeners} from "./HandleSidebarTypeButtons.js";
import {setListInLocalStorage} from "./LocalStorage.js";
import {getPlacesFromJourney} from "./LoadingJourneyFunctions.js";
import {refreshExportLink} from "./ExportToGMaps.js";
import {getPinSvgString} from "./CustomPinsStrings.js";
import {renderTripList, renderWaypointsList} from "./RenderList.js";
import {setNewPlace} from "../script.js";
import {GetAddress} from "./GetAddress.js";

let current_total_time;
let current_total_distance;

export function handleMarkerClick(placeKey, placesInfoWindows, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers, marker = null) {
    google.maps.event.addListenerOnce(placesInfoWindows[placeKey], 'domready', function () {
        const closeButton = $('#close-button');
        const selectButton = $('#select-button');

        function handleButtonClick(event) {
            if (event.target.id === 'close-button') {
                handleCloseButton(placeKey, selectButton, placesInfoWindows);
            } else if (event.target.id === 'select-button') {
                handleSelectButton(placeKey, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers, marker);
            }
        }
        refreshButtons(closeButton, selectButton, handleButtonClick);
    });
}

function handleCloseButton(placeKey, selectButton, placesInfoWindows) {
    selectButton.off('click');
    placesInfoWindows[placeKey].close();
}

async function handleSelectButton(placeKey, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers, marker = null) {
    let result, position, address;
    if (placeKey === 'destination') {
        removeTypesEventListeners(entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler);
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
    if (mainCircle) { mainCircle.setMap(null); }
    listItems.push(address);
    renderWaypointsList(listItems);
    updateDistanceAndTime(result);
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
            console.error(response);
        } else {
            titles.push(title);
            renderTripList(titles, SelectedPlaces, routes, polylines, markers, listItems);
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

async function drawPolyline(markers) {
    const result = await calculateRoute(map, markers.marker1.position, markers.marker2.position);
    if (result) {
        return result;
    } else {
        console.error('Failed to get route data.');
    }
}

async function calculateRoute(map, origin, destination) {
    const apiKey = await getGoogleApiKey();
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
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];

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

async function getGoogleApiKey() {
    const response = await fetch('/api/google-api-key');
    const data = await response.json();
    return data.apiKey;
}

export function clearPlacesMarkers() {
    for (const key in placesMarkers) {
        placesMarkers[key].map = null;
        delete placesMarkers[key];
    }
}