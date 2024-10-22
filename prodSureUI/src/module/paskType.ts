import paskStateEnum from "@/enums/paskStateEnum"



type paskType = {

    /**
     * 主键ID
     */
    askid: number

    /**
     * 创建时间
     */
    createdate: string

    /**
     * 申报人员扫描的工单号
     */
    barcode: string

    /**
     * 后台维护的工单ID号
     */
    moid: number

    /**
     * 上传的图片
     */
    imgfile: Array<string>

    /**
     * 发起工单的人员姓名
     */
    askname: string

    /**
     * 销售专员姓名
     */
    salname: string


    /**
     * 订单ID(后台维护)
     */
    orderid: string


    /**
     * 工单状态
     */
    stage: paskStateEnum,

    /**
     * 详细描述
     */
    memo: string,

    /**
     * 是否已经上机
     */
    standup: boolean,


    /**
     * 是否显示
     */
    show: boolean

    /**
     * 是否外发商
     */
    outsvr: boolean


}

type paskTypes = Array<paskType>

export {
    paskType,
    paskTypes
}