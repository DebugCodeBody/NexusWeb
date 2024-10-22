const titleDoc: Record<string, string> = {
    "1": "转车间",
    "2": "转销售",
    "3": "结案",
    "99": "留言",
}

function setTitle(stage: string | number, index: number) {
    if(index == 0){
        return "发起工单"
    }
    return titleDoc[stage]
}

export default setTitle;