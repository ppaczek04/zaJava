import {removeTypesEventListeners} from "./HandleSidebarTypeButtons.js";
import {setListInLocalStorage} from "./LocalStorage.js";
import {getPlacesFromJourney} from "./LoadingJourneyFunctions.js";
import {refreshExportLink} from "./ExportToGMaps.js";
import {getPinSvgString} from "./CustomPinsStrings.js";
import {renderWaypointsList} from "./RenderList.js";
import {
    addJourneyToDatabase,
    clearPlacesMarkers,
    drawPolyline,
    GetAddress,
    refreshButtons,
    setNewPlace, updateDistanceAndTime
} from "../script.js";

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
    if (mainCircle) { mainCircle.setMap(null); }
    listItems.push(address);
    renderWaypointsList(listItems);
    updateDistanceAndTime(result);
}