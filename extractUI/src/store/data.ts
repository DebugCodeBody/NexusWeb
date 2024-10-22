import { ref, watch } from "vue"
import to from "await-to-js";
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

import { callFinallyFun } from "global@/coreUtils/Common"



import { localContainer } from "@/utils/other"
import { getAllOrder, getUn } from "@/api"

/** 上次缓存的选中标签 */
const localActive = localContainer("extract.activeName", "1");

/** 选中的数据，单个订单或者一个供应商 */
const selectItem = ref<any>()
/** 是否显示单个订单弹窗 */
const extractDialogShow = ref(false);
/** 是否显示全部订单弹窗 */
const allExtractDialogShow = ref(false);


let lastType: number | string = 1;

const presentData = ref<any[]>([]);

const Locat = reactive({
    arr: ["尾1", "尾2", "质佳", "精创"],
    select: ""
})

Locat.select = Locat.arr[3];





/** 封装的一个load加载 */
function getLoadPack(callBack: any) {

    return function (...args: any[]) {

        const loadingInstance = ElLoading.service({
            lock: true,
            text: '正在加载数据',
            background: 'rgba(0, 0, 0, 0.7)',
        });

        return callFinallyFun(async () => {

            const [err, response] = await to(callBack.apply(callBack, args));
            if (err) {
                return Promise.reject();
            }

            return response;

        }, loadingInstance.close)

    }

}



/**
 * 获取数据
 * type = 要获取提货还是撤销，如果不填写会默认用上一次的
 */
export const getData = getLoadPack((type: number | string = lastType) => {

    if (type == "3") {
        return getUnData();
    }

    lastType = type;
    return getAllOrder(type).then((data: any) => {

        presentData.value.splice(0, presentData.value.length, ...data);

        return data;

    })
})

export const getUnData = getLoadPack(() => {

    lastType = 3;
    return getUn(Locat.select).then((data: any) => {
        
        presentData.value.splice(0, presentData.value.length, ...data);



        return data;

    })
})



/** 封装的提交，因为本项目中提交的参数都是两个，一个类型一个id号，而返回的数据也是一模一样。所以可以完好的封装 */
export async function submitData(dialogEl: any, submitFun: any, args: any[]) {


    dialogEl.startSubmit(async () => {

        const extract = args[0];
        const title = extract ? "提货" : "撤销"

        args[0] = extract ? 1 : 2;

        const [submitErr, result] = await to(submitFun.apply(submitFun, args));
        if (submitErr) {
            ElMessageBox.confirm(
                `${title}失败，请重试！`,
                '提示',
                {
                    showCancelButton: false,
                    confirmButtonText: '确认',
                    center: true,
                    type: 'error',
                }
            )
            return;
        }

        dialogEl.close().then(() => {

            if (result) {
                ElMessage.success(`${title}成功`);
            } else {
                ElMessageBox.confirm(
                    `${title}失败，请确认订单状态！`,
                    '提示',
                    {
                        showCancelButton: false,
                        confirmButtonText: '确认',
                        center: true,
                        type: 'error',
                    }
                )
            }


        })


        if (result) {
            nextTick(() => {
                getData();
            })
        }


    });
}

export function setSelectLocal(name: string) {

    Locat.select = name;

    getUnData();

}


export {
    localActive,
    presentData,


    allExtractDialogShow,
    extractDialogShow,
    selectItem,


    Locat

}