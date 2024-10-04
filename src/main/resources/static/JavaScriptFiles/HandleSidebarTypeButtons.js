import {addMarkers, setNewPlace} from "../script.js";

export function addTypeButtonsListeners(entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler) {
    document.getElementById("entertainmentAndRecreation").addEventListener('click', entertainmentClickHandler);
    document.getElementById("foodAndDrink").addEventListener('click', foodAndDrinkClickHandler);
    document.getElementById("culture").addEventListener('click', cultureClickHandler);
    document.getElementById("sport").addEventListener('click', sportClickHandler);
    document.getElementById("busStop").addEventListener('click', busStopClickHandler);
}

export function removeTypesEventListeners(entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler){
    document.getElementById("entertainmentAndRecreation").removeEventListener('click', entertainmentClickHandler);
    document.getElementById("foodAndDrink").removeEventListener('click', foodAndDrinkClickHandler);
    document.getElementById("culture").removeEventListener('click', cultureClickHandler);
    document.getElementById("sport").removeEventListener('click', sportClickHandler);
    document.getElementById("busStop").removeEventListener('click', busStopClickHandler);
}

export function createClickTypesHandler(eventType, place, selections) {
    return function() {
        handleTypeButtonClick(eventType, place, selections);
    }
}

async function handleTypeButtonClick(key, place, selections){
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
        console.error("You should choose starting point first");
    }
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
            console.error('Network response was not ok');
        }

        const points = await response.json();
        console.log('Otrzymane punkty:', points);
        await addMarkers(points);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}