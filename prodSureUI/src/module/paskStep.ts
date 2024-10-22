import paskStateEnum from "@/enums/paskStateEnum"


type paskSetp = {

    /**
     * 创建时间
     */
    createdate: string

    /**
     * 任务创建人员
     */
    username: string 

    /**
     * 任务描述
     */
    memo: string

    /**
     * 任务状态
     */
    stage: paskStateEnum

}

type paskSetps = Array<paskSetp>

export {
    paskSetp,
    paskSetps
}