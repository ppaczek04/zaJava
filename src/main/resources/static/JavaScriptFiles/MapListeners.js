import {getPinSvgString} from "./CustomPinsStrings.js";
import {getInfoWindowContentForDestination} from "./InfoWindowContents.js";
import {calculateDistance, setNewPlace} from "../script.js";
import {addDestinationMarkerListener, addMarkerListener} from "./MarkerListeners.js";
import {getAddress} from "./GetAddress.js";

export function addMapListener(placesInfoWindows, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers){
    let i = 0;
    let markers = {};
    map.addListener('click', async function (event) {
        if (i < 2) {
            const parser = new DOMParser();
            let pinSvgString;
            if (i < 1) {
                pinSvgString = getPinSvgString("home");
                setNewPlace(event.latLng.lat(), event.latLng.lng());
                document.getElementById('origin').value = await getAddress(event.latLng.lat(), event.latLng.lng());
            } else {
                pinSvgString = getPinSvgString("destination");
                document.getElementById('destination').value = await getAddress(event.latLng.lat(), event.latLng.lng());
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
            addMarkerListener(markers[markerKey], placesInfoWindows);      // dla markerów home i destination
            if( i === 1 ){          // dla markera końcowego (destination)
                const position = markers[markerKey].position;
                const response = await calculateDistance(mainMarker.position, {lat: position.lat, lng: position.lng});
                const distance = response.routes[0].distanceMeters;
                placesInfoWindows['destination'] = new google.maps.InfoWindow({
                    content: getInfoWindowContentForDestination(await getAddress(position.lat, position.lng), distance),
                    maxWidth: 270
                });
                addDestinationMarkerListener(markers[markerKey], placesInfoWindows, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers);
            }
            i += 1;
            if(i === 1) {           // dla markera początkowego (home)
                mainMarker = markers[markerKey];
            }
        }
    });
    return markers;
}