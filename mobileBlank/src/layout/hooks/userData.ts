


import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import type { order, machineInfo, machineList } from "@/layout/module";
import type { TouchInput } from "hammerjs";

import { startTime, clearTime } from "./usetTime"


import { getlist, nextorder, addOrder, deleOrder, addtail } from "@/api/index"



const MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
const ISMOBILE = ref(MOBILE_REGEX.test(navigator.userAgent));

const listMachine = reactive<machineList>([]);
const nextOrder = ref<order>({} as order);
const selectValue = ref();

const autoButton = computed(() => {
    /**
     * 2022-07-19 19:04
     * 先把权限放开
     */
    return true;
    // if (ISMOBILE.value) {
    // 	return getButtonAuto()
    // } else {
    // 	return true
    // }
});



const showOverlay = ref(false); // 遮罩层显示




/**
 * 刷新下一个订单
 */
function getNextOrder() {
    // 如果是移动端但是当前用户没有操作权限
    if (ISMOBILE.value && !autoButton.value) {
        return switchOverlay(false);
    }

    return nextorder().then((data: order) => {
        nextOrder.value = data
    }).then(() => {
        switchOverlay(false);
    })
}



/**
 * 在显示遮罩层的时候，需要把刷新定时器给关掉
 * 取消遮罩层的时候，需要把定时器打开
 */
function switchOverlay(status: boolean) {
    if (status != showOverlay.value) {
        showOverlay.value = status
    }

    if (status) {
        clearTime();
    } else {
        startTime(init)
    }
}

const offsetIndex = ref(-1);

/**
 * 左滑右滑事件，更新索引
 */
function updateIndex(event: TouchInput) {
    if (!ISMOBILE.value) {
        return;
    }
    if (event.type == "swipeleft") {

        if (offsetIndex.value < listMachine.length - 1) {
            offsetIndex.value += 1;
        }

    } else {

        if (offsetIndex.value > 0) {
            offsetIndex.value -= 1;
        }
    }

    selectValue.value = offsetIndex.value;

}



async function onAddOrder(match: machineInfo) {
    if (match.mid == 999) {
        return;
    }

    switchOverlay(true);
    try {
        await addOrder(match.mid, nextOrder.value.seq);

        match.order.push(nextOrder.value);

        getNextOrder();

    } catch (error) {
        init();
    }

}


async function init() {
    switchOverlay(true);
    try {
        let select = false;
        let selectMid = 1;
        if (listMachine.length == 0 && ISMOBILE.value) {
            select = true;
            try {
                selectMid = parseInt(new URLSearchParams(location.search).get("mid") || "1") || 1;
            } catch (err) {
                selectMid = 1;
            }

        }

        const response: machineList = await getlist() as machineList;

        listMachine.splice(0, listMachine.length, ...response);

        getNextOrder();

        if (select) {
            selectValue.value = response.findIndex((item) => {
                return item.mid == selectMid;
            })
        }


    } catch (err) {
        switchOverlay(false);
    }

}

export default function () {

    return {
        listMachine,
        nextOrder,
        selectValue,
        offsetIndex,
        showOverlay,

        autoButton,
        ISMOBILE,

        init,
        switchOverlay,
        onAddOrder,
        getNextOrder,
        updateIndex
    }
}