import jsonView from "@/utils/jsonView";
import jsonEditPack from "jsoneditor/jsoneditor.js"






declare global {
    type JsonView = InstanceType<typeof jsonView>;
    


    /** json点击回调类型 */
    type selectType = {
        /** 选中的字段 */
        field: string,
        /** 选中的路径 */
        path: string[],
        /** 当前选中路径的值 */
        value: any,
        /** 当前选中值的类型 */
        type: typeEnum
    }


}


