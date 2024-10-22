import { computed } from "vue"
import { defineStore } from "pinia"
import parseOrder from "@/utils/order";


const TokenKey = 'order_info'

function getLocalObject() {
    try {
        return JSON.parse(localStorage.getItem(TokenKey)!) || {};
    } catch (error) {
        return {}
    }
}


const tabs = computed<string>({
    get() {
        return getLocalObject().tabs || "";
    },
    set(value) {
        const storage = getLocalObject();

        storage.tabs = value;
        localStorage.setItem(TokenKey, JSON.stringify(storage));

    }
})

export const orderStore = defineStore('order', {
    state: () => {
        const search = new URLSearchParams(location.search);
        const orderList: Array<string> = parseOrder(search.get("order")!);

        const selectOrder: Array<string> = [];

        return {
            order: "",
            orderList,
            selectOrder,
            activeOrder: ""
        }
    },
    getters: {
        tabs(){
            return tabs;
        }
    },
    actions: {
        addOrder(val: string) {
            if (this.orderList.indexOf(val) == -1) {
                this.orderList.push(val);
            }
        },
        toOrder(val: string) {
            this.activeOrder = val;
        },
        setTabs(val: string) {
            tabs.value = val;
        }

    },
})