function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 13
    });
    let markers = {};
    let i = 0;

    map.addListener('click', function (event) {
        if (i < 2) {
            const markerKey = `marker${i + 1}`;
            markers[markerKey] = new google.maps.Marker({
                map: map,
                position: event.latLng,
                title: markerKey,
                animation: google.maps.Animation.DROP,
                draggable: true,
            });
            markers[markerKey].addListener('dragend', function() {
                console.log(`${markers[markerKey].getTitle()} został przeniesiony na: ${markers[markerKey].getPosition()}`);
            });
            i += 1;
        }
    });
}
map.addListener('click', function (event) {
    if (i < 2) {
        const markerKey = `marker${i + 1}`;
        markers[markerKey] = new google.maps.Marker({
            map: map,
            position: event.latLng,
            title: markerKey,
            animation: google.maps.Animation.DROP,
            draggable: true,
        });
        markers[markerKey].addListener('dragend', function() {
            console.log(`${markers[markerKey].getTitle()} został przeniesiony na: ${markers[markerKey].getPosition()}`);
        });
        i += 1;
    }
});

// Calculate route between the markers
document.getElementById("calculateRouteBtn").addEventListener("click", function() {
    if (markers.marker1 && markers.marker2) {
        calculateRoute(markers.marker1.getPosition(), markers.marker2.getPosition());
    } else {
        alert("Proszę wybrać dwa punkty na mapie.");
    }
});
}

function calculateRoute(origin, destination) {
    const requestBody = {
        originLatitude: origin.lat(),
        originLongitude: origin.lng(),
        destinationLatitude: destination.lat(),
        destinationLongitude: destination.lng()
    };

    fetch('/api/routes/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Odległość:', data.distance);
            console.log('Czas trwania:', data.time);
        })
        .catch(error => console.error('Error:', error));
}



