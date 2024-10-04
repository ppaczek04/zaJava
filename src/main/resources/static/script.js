import {getListFromLocalStorage} from "./JavaScriptFiles/LocalStorage.js";
import {renderTripList} from "./JavaScriptFiles/RenderList.js";
import {createClickTypesHandler} from "./JavaScriptFiles/HandleSidebarTypeButtons.js";
import {addMapListener} from "./JavaScriptFiles/MapListeners.js";
import {getPinSvgString} from "./JavaScriptFiles/CustomPinsStrings.js";
import {getInfoWindowContent} from "./JavaScriptFiles/InfoWindowContents.js";
import {closeOtherInfoWindows} from "./JavaScriptFiles/InfoWindowsActions.js";
import {clearPlacesMarkers, handleMarkerClick} from "./JavaScriptFiles/HandleMarkerClick.js";
import {getPlaceInfo} from "./JavaScriptFiles/AddMarkersAndInfoWindows.js";
import {handleSubmitButtons} from "./JavaScriptFiles/HandleSubmitButtons.js";


let testCircle;
const selections = {
    foodAndDrink: false,
    culture: false,
    entertainmentAndRecreation: false,
    sport: false,
    busStop: false
};
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

    addTestCircleListener();

    // Actions after confirming origin and destination points
    handleSubmitButtons(entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler);
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

function addTestCircleListener(){
    document.getElementById("test-radius").addEventListener("mouseover", function(){
        if(testCircle) { testCircle.setMap(null); }
        testCircle = addCircle(Math.floor(document.getElementById('radius').value));
    });
    document.getElementById("test-radius").addEventListener("mouseout", function(){
        if(testCircle) { testCircle.setMap(null); }
    });
}

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