import {getInfoWindowContentForDestination} from "./InfoWindowContents.js";
import {calculateDistance, setNewPlace} from "../script.js";
import {closeOtherInfoWindows} from "./InfoWindowsActions.js";
import {handleMarkerClick} from "./HandleMarkerClick.js";
import {GetAddress} from "./GetAddress.js";

export function addDestinationMarkerListener(marker, placesInfoWindows, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers){
    marker.addListener('click', function () {
        closeOtherInfoWindows(placesInfoWindows);
        placesInfoWindows['destination'].open({
            anchor: marker,
            map: map,
        });
        handleMarkerClick('destination', placesInfoWindows, entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler, placesMarkers, marker);
    });
}

export function addMarkerListener(marker, placesInfoWindows){
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
