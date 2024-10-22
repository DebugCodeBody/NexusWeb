

/** 详细负责人 */
interface dUser extends user {
    /** 群id */
    group: number,
    /** 钉钉ID */
    dingid: string,
    /** 用户empid */
    empid: number,
}

type dUsers = dUser[];


/** 字段 */
type field = {
    type: number,
    child: string[]
}

type personnel = {
    id: number,
    name: string
}

type personnels = personnel[];



/** 详细负责群信息 */
interface GroupInfo extends Group {
    hook: string,
    child: dUsers,
    /** 责任人 */
    person: personnels
    /** 快捷输入 */
    quick: personnels,
    /** 负责组 */
    group: personnels,

    // 回复类型
    response_type: number,    

    // 是否允许撤回
    is_withdraw: boolean,    

    /** 是否禁用 */
    disabled: boolean,    


    field: {
        /** 责任人 */
        person: field,
        /** 快捷输入 */
        quick: field

    }
}

type GroupInfos = Array<GroupInfo>