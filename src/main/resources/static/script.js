import {getInfoWindowContent} from "./JavaScriptFiles/InfoWindowContents.js";
import {getListFromLocalStorage} from "./JavaScriptFiles/LocalStorage.js";
import {getPinSvgString} from "./JavaScriptFiles/CustomPinsStrings.js";
import {renderTripList, renderWaypointsList} from "./JavaScriptFiles/RenderList.js";
import {
    addTypeButtonsListeners,
    createClickTypesHandler,
} from "./JavaScriptFiles/HandleSidebarTypeButtons.js";
import {addMapListener} from "./JavaScriptFiles/MapListeners.js";
import {handleMarkerClick} from "./JavaScriptFiles/HandleMarkerClick.js";
import {closeOtherInfoWindows} from "./JavaScriptFiles/InfoWindowsActions.js";

let placesMarkers = {};
let placesInfoWindows = {};
const selections = {
    foodAndDrink: false,
    culture: false,
    entertainmentAndRecreation: false,
    sport: false,
    busStop: false
};
let testCircle;
let current_total_time;
let current_total_distance;

let markers = {};
let polylines = [];
let routeNumberInJourney = 0;

const entertainmentClickHandler = createClickTypesHandler('entertainment', Place, selections);
const foodAndDrinkClickHandler = createClickTypesHandler('foodAndDrink', Place, selections);
const cultureClickHandler = createClickTypesHandler('culture', Place, selections);
const sportClickHandler = createClickTypesHandler('sport', Place, selections);
const busStopClickHandler = createClickTypesHandler('busStop', Place, selections);

main();
function main(){
    setDefaults(1500);

    // Add listener to create a marker after click
    markers = addMapListener(placesInfoWindows, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers);

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
                addTypeButtonsListeners(entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler)
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

function setDefaults(radius){
    titles = getListFromLocalStorage('savedRoutes');
    console.log(titles);
    renderTripList(titles, SelectedPlaces, routes, polylines, markers, listItems);
    document.getElementById('radius').value = radius;
    document.getElementById('total-time').textContent = '0';
    document.getElementById('total-distance').textContent = '0';
    document.getElementById('origin').value = "Click on the map";
    document.getElementById('destination').value = "Click on the map";
}

export function setNewPlace(latitude, longitude){
    Place.latitude = latitude;
    Place.longitude = longitude;
}

export async function drawPolyline(markers) {
    const result = await calculateRoute(map, markers.marker1.position, markers.marker2.position);
    if (result) {
        return result;
    } else {
        console.error('Failed to get route data.');
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
            handleMarkerClick(placeKey, placesInfoWindows, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers);
            });
            i += 1;
    }
}


export function clearPlacesMarkers() {
    for (const key in placesMarkers) {
        placesMarkers[key].map = null;
        delete placesMarkers[key];
    }
}

export function refreshButtons(closeButton, selectButton, functionName){
    closeButton.off('click');
    selectButton.off('click');
    closeButton.on('click', functionName);
    selectButton.on('click', functionName);
}

export function updateDistanceAndTime(result){
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

async function getGoogleApiKey() {
    const response = await fetch('/api/google-api-key');
    const data = await response.json();
    return data.apiKey;
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


export async function calculateDistance(origin, destination) {
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
export async function addJourneyToDatabase(title, routes){
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