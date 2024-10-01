export function generateGoogleMapsLink(points, travelMode = "walking") {
    if (points.length < 2) {
        throw new Error("You have to choose at least two points");
    }

    const origin = `${points[0].latitude},${points[0].longitude}`;
    const destination = `${points[points.length - 1].latitude},${points[points.length - 1].longitude}`;

    let waypointsParam = "";
    if (points.length > 2) {
        const waypoints = points.slice(1, points.length - 1)
            .map(point => `${point.latitude},${point.longitude}`)
            .join('|');
        waypointsParam = `&waypoints=${waypoints}`;
    }

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=${travelMode}`;
}

export function refreshExportLink(newPoints){
    const linkElement = document.getElementById("link");
    const newLinkElement = linkElement.cloneNode(true);
    linkElement.replaceWith(newLinkElement);
    newLinkElement.addEventListener("click", function () {
        handleClickLink(newPoints);
    });
}

export function handleClickLink(newPoints){
    const link = generateGoogleMapsLink(newPoints);
    console.log("Link do Google Maps:", link);
    window.open(link, "_blank");
}