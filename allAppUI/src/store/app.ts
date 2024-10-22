
const appList = [
    {
        name: "点餐",
        url: "/neweatmeal",
        view: [
            {
                path: "main"
            }
        ]
    },
    {
        name: "工单扫码",
        url: "/task",
        isDing: true

    },
    {
        name: "考勤核对",
        url: "/workhour",
        isDing: true
    },
    {
        name: "切料看板",
        url: "/blank"
    },
    {
        name: "切料看板",
        url: "/blank"
    },
    {
        name: "采购申请",
        url: "/purchase",
        view: [
            {
                name: "登记",
                path: "declare"
            },
            {
                name: "看板",
                path: "preview"
            }
        ]
    },
    {
        name: "材多送货",
        url: "/caiduo/truckorder"
    },
    {
        name: "采购提货",
        url: "/caiduo/extract"
    },
    {
        name: "货拉拉图片",
        url: "/huolalapic"
    },

    {
        name: "扫码看图纸",
        url: "/onlineorder/scanDrawings"
    },
    {
        name: "刀具领取",
        url: "/nexus/cutter"
    },
    {
        name: "出车报销",
        url: "/nexus/carexpense"
    },
    {
        name: "清理货架",
        url: "/caiduo/dorackscan"
    },
    {
        name: "网上采购申请审批",
        url: "/nexus/procureflow"
    },
    {
        name: "材多退卡板",
        url: "/nexus/carexpense"
    },
    {
        name: "日产能登记",
        url: "/nexus/frmmodaily"
    },
    {
        name: "日产能登记",
        url: "/nexus/frmmodaily"
    },
    {
        name: "切料完工",
        url: "/erp/scanwork"
    },
    {
        name: "精创工艺",
        url: "/xjc/scanitem"
    },

] as appItem[];
