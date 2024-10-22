import moment from "moment";

declare interface WorkTable {
    /**
     * 日期时间
     */
    time: string

    /**
     * 打卡时间
     */
    clock: Array<string>

    /**
     * 加班小时
     */
    work: string

    /**
     * 餐费
     */
    meals: string

    /**
     * 补贴
     */
    buckle: string

    /**
     * 津贴
     */
    allowance: string

    /**
     * 请假
     */
    leave: Array<string>


    /**
     * 是否异常
     */
    error: boolean

}

declare interface weekThe {
    start: moment.Moment
    end: moment.Moment
    day: number
}

type WorkTables = Array<Array<WorkTable>>;

export type {
    WorkTables,
    WorkTable,
    weekThe
};

