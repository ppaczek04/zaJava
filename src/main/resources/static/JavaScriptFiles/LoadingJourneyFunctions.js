import {addMarkers} from "../script.js";

export async function getJourney(journeyTitle){
    const points = await getPlacesFromJourney(journeyTitle);
    const polylines = await getPolylinesFromJourney(journeyTitle);
    const new_points = points.map(place => ({
        placeId: place.id,
        latitude: place.latitude,
        longitude: place.longitude
    }));

    await drawPolylines(polylines);
    await addMarkers(new_points, false);
}

export async function getPlacesFromJourney(journeyTitle) {
    try {
        const response = await fetch('/journey/get/places', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: journeyTitle})
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            const errorBody = await response.text();
            console.error('Response body:', errorBody);
        }

        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

export async function getPolylinesFromJourney(journeyTitle) {
    try {
        const response = await fetch('/journey/get/polylines', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({title: journeyTitle})
        });

        if (!response.ok) {
            console.error('Response status:', response.status);
            const errorBody = await response.text();
            console.error('Response body:', errorBody);
        }

        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

export async function drawPolylineOfSavedJourney(polyline) {
    const path = google.maps.geometry.encoding.decodePath(polyline);

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

export async function drawPolylines(polylines) {
    for (const polyline of polylines) {
        await drawPolylineOfSavedJourney(polyline);
    }
}

export async function getTotalJourneyDistance(journeyTitle) {
    try {
        const response = await fetch('/journey/total-distance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: journeyTitle }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Error fetching total journey distance:", errorMessage);
            return Promise.reject(new Error(errorMessage));
        }

        return await response.text();
    } catch (error) {
        console.error("Error occurred while fetching total journey distance:", error);
        return Promise.reject(new Error("An unexpected error occurred while fetching journey distance."));
    }
}

export async function getTotalJourneyTime(journeyTitle) {
    try {
        const response = await fetch('/journey/total-time', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({title: journeyTitle}),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Error fetching total journey time:", errorMessage);
            return Promise.reject(new Error(errorMessage));
        }

        return await response.text();
    } catch (error) {
        console.error("Error occurred while fetching total journey time:", error);
        return Promise.reject(new Error("An unexpected error occurred while fetching journey time."));
    }
}