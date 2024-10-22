
interface Time {
    /** 小时 */
    hours: number,
    /** 分钟 */
    minutes: number
}


interface Order {
    /** 唯一工单号 */
    moid: number,
    /** 工单号 */
    moname: string,
    /** 材料 */
    material: string,
    /** 规格 */
    matspec: string,
    /** 数量 */
    qty: string,
    /** 交货日期 */
    delivery_date: string,
    /** 机器名字 */
    woname: string,
    /** 工时 */
    workhour: Time,
    /** 开始日期 */
    plan_start: string,
    /** 结束日期 */
    plan_done: string,
    /** 状态 */
    state: string,
    /** 部门ID */
    deptid: number,
    /** 车间名字 */
    deptname: string,
    /** 是否允许开始 */
    canstart: boolean
}

type Orders = Order[];



/** 部门 */
interface Dept {
    /** 部门ID */
    deptid: number,
    /** 部门名字 */
    deptname: string
}

/** 部门 */
type Depts = Dept[];


/** 机器 */
interface Mach {
    /** 机器编号 */
    id: number,
    /** 机器名字 */
    name: string,
    /** 机器订单 */
    data: Orders

}
type Machs = Mach[];


/** Vue注入部门类型 */
interface provideDept {
    select: number,
    data: Depts
}