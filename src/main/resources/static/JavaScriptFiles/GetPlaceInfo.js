export async function getPlaceInfo(placeId) {
    try {
        const response = await fetch('/places/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(placeId)
        });

        if (!response.ok) {
            console.error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}