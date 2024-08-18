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



