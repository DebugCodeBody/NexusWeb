import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'


const rules = reactive<FormRules>({
    name: [
        { required: true, message: '申报人员不能为为空', trigger: 'blur' },
    ],
    barcode: [
        {
            required: true,
            message: '工单号码不能为空',
            trigger: 'change',
        },
    ]
})


export default rules