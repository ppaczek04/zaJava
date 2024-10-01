export function getListFromLocalStorage(name) {
    const savedList = localStorage.getItem(name);
    return savedList ? JSON.parse(savedList) : [];
}

export function setListInLocalStorage(name, titles){
    localStorage.setItem(name, JSON.stringify(titles));
}