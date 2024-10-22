



import { ref, reactive, nextTick, watch, computed } from "vue";
import type { FormInstance, FormRules } from 'element-plus'


const ruleForm = reactive({
    /**
     * 提交人
     */
    name: String.Empty,
    /**
     * 详细描述
     */
    describe: String.Empty,
    /**
     * 工单单号
     */
    order: String.Empty,
    /**
     * 工单条码
     */
    barcode: String.Empty,
    /**
     * 负责部门
     */
    branch: String.Empty,
    /**
     * 负责人
     */
    person: String.Empty,
})


const ruleRules = reactive<FormRules>({
    name: [
        { required: true, message: '登记人员不能为空', trigger: 'blur' }
    ],
    order: [
        { required: true, message: '工单条码不能为空', trigger: 'blur' }
    ],
    branch: [
        { required: true, message: '负责部门不能为空', trigger: 'change' }
    ]
})


export {
    ruleForm,
    ruleRules
}





























































































