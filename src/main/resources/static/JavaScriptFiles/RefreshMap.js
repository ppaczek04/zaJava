import {
    getJourney,
    getPlacesFromJourney,
    getTotalJourneyDistance,
    getTotalJourneyTime
} from "./LoadingJourneyFunctions.js";
import {refreshExportLink} from "./ExportToGMaps.js";
import {renderWaypointsList} from "./RenderList.js";
import {getAddress} from "./GetAddress.js";

export async function  clearAndSetMap(title, SelectedPlaces, routes, polylines, markers, listItems){
    // Clearing SelectedPlaces, home, destination and polylines
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
    routes = [];

    listItems = [];
    const points = await getPlacesFromJourney(title);
    const newPoints = points.map(place => ({
        placeId: place.id,
        latitude: place.latitude,
        longitude: place.longitude
    }));
    refreshExportLink(newPoints);
    listItems = [];
    for (const point of newPoints) {
        listItems.push(await getAddress(point.latitude, point.longitude));
    }
    await renderWaypointsList(listItems);
    map.setCenter(new google.maps.LatLng(newPoints[0].latitude, newPoints[0].longitude));
    document.getElementById('total-time').textContent = await getTotalJourneyTime(title);
    document.getElementById('total-distance').textContent = await getTotalJourneyDistance(title);
    document.getElementById('editable-title').contentEditable = false;
    document.getElementById('editable-title').textContent = title;
    document.getElementById('origin').value = await getAddress(newPoints[0].latitude, newPoints[0].longitude);
    document.getElementById('destination').value = await getAddress(newPoints[newPoints.length - 1].latitude, newPoints[newPoints.length - 1].longitude);
    await getJourney(title);
}