async function initMap(callback) {
    const myPos = { lat: 50.041, lng: 21.999 };

    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: myPos,
        zoom: 14,
        mapId: "4504f8b37365c3d0", // Ensure this is a valid mapId, or remove it if using default map styles
    });

    // Define a custom icon
    const customIcon = {
        url: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png',
        scaledSize: new google.maps.Size(17, 25),  // Set desired size
        origin: new google.maps.Point(0, 0),       // The origin for this image
        anchor: new google.maps.Point(10, 25)      // The anchor for this image
    };

    // Create a marker with the custom icon
    const marker = new google.maps.Marker({
        map: map,
        position: myPos,
        title: "Rzeszow",
        icon: customIcon,
        animation: google.maps.Animation.DROP,
    });

    // Initialize an info window
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myPos,
    });

    // Open the info window
    infoWindow.open(map);

    // Configure the click listener for the map
    map.addListener("click", function(mapsMouseEvent) {
        // Zamknij obecne info window, jeśli istnieje
        if (infoWindow) {
            infoWindow.close();
        }

        // Utwórz nowy marker na pozycji kliknięcia
        const marker1 = new google.maps.Marker({
            map: map,
            position: mapsMouseEvent.latLng,
            title: "Rzeszow",
            icon: customIcon,
            animation: google.maps.Animation.DROP,
        });

        // Utwórz nową instancję info window
        infoWindow = new google.maps.InfoWindow({
            content: `<pre>${JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)}</pre>`
        });

        // Otwórz info window w miejscu markera
        infoWindow.open(map, marker1);
    });


}

// Initialize the map after the API is loaded
window.initMap = initMap;