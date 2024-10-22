

const manage = reactive({

    popModel: {
        /** 配合件扫码验证 */
        match: false,

        /** 不良原因的弹窗 */
        reason: false,
        /** 不良添加工艺的弹窗 */
        badness: false,
    },
    scanResult: {

        state: [
            {
                id: 1,
                name: "良品"
            },
            {
                id: 2,
                name: "不良品"
            }
        ],

        /** 工单号 */
        order: "",

        /** 工艺列表 */
        process: [] as processItem[],
        /** 不良原因的列表 */
        reason: [] as reasonItem[],
        /** 不良添加工艺的列表 */
        badness: [] as nameItem[],


        /** 错误的异常 */
        msg: "",
        /** 警告内容 */
        warn: "",
        /** 配合件订单号 */
        match: [] as string[]

    },

    form: {

        /** 扫描的moid */
        moid: "",
        /** 选中的状态 */
        state: 0,

        /** 选中的工序 */
        process: undefined as any as number,
        /** 选中的不良 */
        reason: "",
        /** 二级确认的选中的文本 */
        next: "",

        /** 不良添加工艺的选中 */
        badness: "",


    },

    submit: {

        /** 是否提交内容 */
        value: false,
        /** 是否成功 */
        success: false,
        /**  */
        msg: "",
        /** 需要弹窗的内容 */
        warn: "",
        /** 下一道工序 */
        next: ""

    }



})


export default manage;