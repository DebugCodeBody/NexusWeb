import { ref, reactive } from "vue"
import { createAddress, search, getAddressAll } from "@/api/address"


const selectAddress = ref("");
const allAddress = reactive<any[]>([]);



async function init() {

    const response = await getAddressAll();

    allAddress.splice(0, allAddress.length, ...response);

    if (allAddress.length > 0) {
        selectAddress.value = response[0].id;
    } else {
        selectAddress.value = (undefined as any);
    }

}

init();

function getAcquire() {
    return init();
}


export {
    selectAddress,
    allAddress,
    getAcquire
}


