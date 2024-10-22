



const itemKey = "showAll";

let showAll = localStorage.getItem(itemKey) as any || {};
if (typeof showAll == "string") {

    try {
        showAll = JSON.parse(showAll);
    } catch {
        showAll = {};
    }

}

if (typeof showAll != "object") {
    showAll = {};
}


export function setAll(key: string | number, value: boolean) {

    showAll[key] = value;

    localStorage.setItem(itemKey, JSON.stringify(showAll))

}

export function getAll(key: string | number) {

    let value = showAll[key];
    if (value == undefined) {
        value = true;

        setAll(key, value);

    }

    return value;

}



const showDialog = reactive({
    item: undefined as any as mettItem,
    refresh: false,
    trackUser: false
});

export {
    showDialog
};