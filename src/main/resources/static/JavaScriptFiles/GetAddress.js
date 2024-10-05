export async function getAddress(latitude, longitude) {
    try {
        const response = await fetch('/address/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                point: {
                    latitude: latitude,
                    longitude: longitude
                }
            })
        });
        if (!response.ok) {
            console.error('Network response was not ok');
        }
        return removeLocationCode(await response.text());
    } catch (error) {
        console.error('Error fetching address:', error);
        return null;
    }
}
function removeLocationCode(str) {
    const pattern = /^[A-Z0-9]{4}\+[A-Z0-9]{2}\s*/;
    return str.replace(pattern, '');
}