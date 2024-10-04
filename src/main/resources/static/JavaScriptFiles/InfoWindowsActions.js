export function closeOtherInfoWindows(placesInfoWindows){
    for(const key in placesInfoWindows) {
        if (placesInfoWindows[key].isOpen) {
            document.getElementById('close-button').click();
        }
    }
}