import {GetAddress} from "./GetAddress.js";
import {renderWaypointsList} from "./RenderList.js";
import {addTypeButtonsListeners} from "./HandleSidebarTypeButtons.js";


$('.submit-btn').on('click', function() {
    $(this).addClass('clicked');
});

export function handleSubmitButtons(entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler){
    document.getElementById("submit-origin").addEventListener("click", async function handleClick() {
        document.getElementById("submit-origin").removeEventListener("click", handleClick);
        try {
            const address = await GetAddress(markers.marker1.position.lat, markers.marker1.position.lng);
            listItems.push(address);
            renderWaypointsList(listItems);
            markers.marker1.gmpDraggable = false;
        } catch (error) {
            console.error(error);
            document.getElementById("submit-origin").addEventListener("click", handleClick);
        }
    });

    document.getElementById("submit-destination").addEventListener("click", async function handleClick() {
        try {
            if(!markers.marker1.gmpDraggable){
                document.getElementById("submit-destination").removeEventListener("click", handleClick);
                markers.marker2.gmpDraggable = false;
                addTypeButtonsListeners(entertainmentClickHandler, foodAndDrinkClickHandler, cultureClickHandler, sportClickHandler, busStopClickHandler)
            }
            else{
                Swal.fire({
                    title: "Submit home point first, please",
                    icon: "info"
                });
            }

        } catch (error) {
            console.error(error);
        }
    });
}