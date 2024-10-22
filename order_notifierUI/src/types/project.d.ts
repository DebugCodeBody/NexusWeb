/** 任务 */
interface Item {
    /** 详细信息 */
    info: string,
    /** 负责群ID */
    group: number,
    /** 负责人ID */
    head: number[],
    /** 是否紧急 */
    tight: boolean,
    /** 截止时间 */
    endtime: string
    /** 当前任务的状态 */
    stageid: number,
    /** 图片链接 */
    imgfile: string[],
    /** 最后的留言 */
    lscmemo:string,
    /** 最后的留言 */
    updatetime:string
    /** 工程评判 */
    is_eva: boolean,

    /** 工程部 */
    ckdept: string|null
}


/** 列的任务 */
interface workItem extends Item {
    /** 任务ID */
    id: number | string;
    /** 创建任务的用户名字 */
    fname: string,
    /** 创建任务时间 */
    createdate: string
}

type workItems = Array<workItem>;


/** 负责人 */
interface user {
    id: number;
    name: string;
}


type users = user[];


/** 负责群 */
interface Group {
    id: number;
    name: string;
    child: user[];
    color: string;
}

type Groups = Array<Group>





interface provideForm<T = any> {
    /** 是否打开编辑或者添加弹窗 */
    open: boolean,
    /** 编辑或者添加动作 */
    action: string,
    /** 选中的标题 */
    item: T,
    /** 是否打开任务弹窗 */
    openStep: boolean
}



interface workStep {
    /** 唯一ID */
    "id": number,
    /** 留言 */
    "memo": string
    /** 创建时间 */
    "createdate": string
    /** 关联ID，重要 */
    "askid": number,
    /** 当前状态 */
    "stageid": number,
    /** 创建人的名字 */
    "username": string
}

type workSteps = workStep[]