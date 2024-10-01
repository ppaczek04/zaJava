import {clearAndSetMap} from "./RefreshMap.js";

export function renderWaypointsList(listItems) {
    const list = document.getElementById('dynamic-list');
    list.innerHTML = '';
    listItems.forEach(item => {
        const li = document.createElement('li');
        const p = document.createElement('p');
        p.textContent = item;
        li.appendChild(p);
        list.appendChild(li);
    });
}

export function renderTripList(titles, SelectedPlaces, routes, polylines, markers, listItems) {
    const list = document.getElementById('saved-routes');
    list.innerHTML = '';
    titles.forEach(title => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.classList.add('btn-trips');
        button.textContent = title;
        addButtonListener(button, title, SelectedPlaces, routes, polylines, markers, listItems);
        li.appendChild(button);
        list.appendChild(li);
    });
}

function addButtonListener(button, title, SelectedPlaces, routes, polylines, markers, listItems){
    button.addEventListener('click', async function () {
        await clearAndSetMap(title, SelectedPlaces, routes, polylines, markers, listItems);
    });
}