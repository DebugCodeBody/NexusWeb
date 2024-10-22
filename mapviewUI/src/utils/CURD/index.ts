

const operateMap = {
    /** 没有任何操作 */
    "empty": "",
    /** 新增 */
    "add": "add",
    /** 编辑 */
    "edit": "edit",
}


class CURD<T = any> {


    /** 数据源 */
    data: T[] = []

    editData: T = undefined as any as T

    /** 当前的操作 */
    operate = ""


    constructor() {

    }


    get isEmpty() {
        return this.operate == operateMap.empty;
    }

    /** 当前是否在新增状态 */
    get isAdd() {
        return this.operate == operateMap.add;
    }


    /** 当前是否在编辑状态 */
    get isEdit() {
        return this.operate == operateMap.edit
    }


    setData(data: T | T[]) {

        if (!Array.isArray(data)) {
            data = [data]
        }

        this.data.push(...data);
    }

    /** 开始添加 */
    startAdd() {
        this.operate = operateMap.add;
    }


    /** 结束添加 */
    endAdd() {
        this.operate = operateMap.empty;
    }

    startEdit(item: T) {
        this.editData = item;
        this.operate = operateMap.edit;

    }

    endEdit() {
        this.operate = operateMap.empty;
    }

    /** 删除 */
    delete() {

    }


    /** 编辑 */
    edit() {

    }





}




export default CURD;

