import { paskType, paskTypes } from "@/module/paskType"
import { paskSetps } from "@/module/paskStep"

import paskStateEnum from "@/enums/paskStateEnum"

import { Document, CircleCheck, Edit, TrendCharts } from '@element-plus/icons-vue'

import { shallowReactive, shallowRef, ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { getPaskProcess } from "@/api"


type setpProb = {
    process: paskSetps,
    /**
     * 快捷描述
     */
    prob: Array<string>
}



// type popEmp<T, K extends T> = T extends K ? never : T;
// type popGuestbook = popEmp<paskStateEnum, paskStateEnum.GUESTBOOK>;



const table: Record<paskStateEnum, any> = {
    [paskStateEnum.OUT]: {
        icon: Document,
        button: "转外发",
        title: "外发问数",
        stage: paskStateEnum.OUT
    },
    [paskStateEnum.PREPA]: {
        icon: Document,
        button: "转车间",
        title: "车间问数",
        stage: paskStateEnum.PREPA
    },
    [paskStateEnum.TRACK]: {
        icon: TrendCharts,
        button: "转销售",
        title: "销售专员",
        stage: paskStateEnum.TRACK
    },
    [paskStateEnum.CLOSE]: {
        icon: CircleCheck,
        button: "转结案",
        title: "结案",
        stage: paskStateEnum.CLOSE
    },
    [paskStateEnum.GUESTBOOK]: {
        icon: Edit,
        button: "留言",
        title: "留言",
        stage: paskStateEnum.GUESTBOOK
    }
};



const paskList = reactive<Record<paskStateEnum, paskTypes>>({
    [paskStateEnum.OUT]: [],
    [paskStateEnum.PREPA]: [],
    [paskStateEnum.TRACK]: [],
    [paskStateEnum.CLOSE]: [],
    [paskStateEnum.GUESTBOOK]: []
})



/**
 * 任务流程弹窗是否显示
 */
const Dialog = ref(false);
/**
 * 销售专员名字
 */
const salename = reactive<Array<string>>([]);
/**
 * 选中的工单
 */
const seleItem = ref<paskType>({} as paskType);
/**
 * 任务流程
 */
const setp = ref<setpProb>({} as any);


const processMap = Object.create({});


/**
 * 详细描述
 */
const nextMemo = ref(String.Empty);
const tempNextSetp = shallowRef(table[paskStateEnum.PREPA]);
/**
 * 下一步骤
 */
const nextSetp = computed({
    get() {
        return tempNextSetp.value;
    },
    set(value: any) {
        tempNextSetp.value = value;

    }
});


function getStaticImgSrc(src: string) {
    // 这里需要区分生产环境和开发环境，开发的时候有proxy代理可以直接跳转过去
    return (process.env.NODE_ENV == "production" ? "../" : "") + `media/img/${src.replace("\\", "/")}`
}

/**
 * 取出某一工单的任务流程
 * @param item 
 * @returns 
 */
function getWorkProcess(item: paskType): Promise<setpProb> {
    return new Promise((resolve, reject) => {
        const { askid } = item;

        if (processMap[askid]) {
            resolve(processMap[askid]);
            return;
        }

        getPaskProcess(askid).then((data) => {

            processMap[askid] = data;
            resolve(data as any as setpProb);

        }).catch(reject);

    })

}

/**
 * 设置数据
 * @param data 
 */
function setData(data: any) {

    Object.keys(paskList).forEach((key) => {
        if (!data[key]) {
            return;
        }

        data[key].forEach((elem: paskType) => {
            elem.show = true;
        });

        paskList[key as unknown as paskStateEnum] = data[key];

    })

}

/**
 * 任务流程选中的下一模式
 */
const nextModel = ref<paskStateEnum>(seleItem.value.stage);
watch(nextModel, (value) => {
    if (seleItem.value.stage != paskStateEnum.CLOSE) {
        nextSetp.value = table[value!];
    }
}, {
    immediate: true
})
watch(seleItem, (value) => {
    if (value) {
        if (seleItem.value.outsvr) {
            nextModel.value = 0;
        } else {
            nextModel.value = seleItem.value.stage;

        }
    }
})


export {
    Dialog,
    seleItem,
    paskList,
    setp,
    salename,
    table,

    nextMemo,
    nextSetp,
    nextModel,

    setData,
    getStaticImgSrc,
    getWorkProcess
}