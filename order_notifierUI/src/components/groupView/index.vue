<template>
    <el-form :model="form" label-width="auto" ref="dataForm" size="default" :hideRequiredAsterisk="true" :rules="rules">
        <div v-loading="true" style="height: 300px;" v-if="formItem.length == 0"></div>

        <template v-for="(item, index) in formItem" :key="index">

            <el-form-item :prop="item.prop" :label="item.label" v-if="item.child ? item.child.length : true">

                <order-input v-if="item.type == 'order'" v-model="form.order" />
                <upload-file v-else-if="item.type == 'upload'" ref="uploadEl" v-model="fileLength" :height="80"
                    :width="80" />

                <el-input-number v-else-if="item.type == 'inputNumber'" :min="1" v-model="form.pcs" />

                <el-switch v-else-if="item.type == 'switch'" v-model="(form as any)[(item.model || 'tight')]" />

                <template v-else-if="item.type == 'person'">
                    <el-radio-group v-model="form.person" class="person">
                        <el-radio v-for="(child, index) in sorePerson(item.child!)" :label="child.name" :key="index">
                            {{ child.name }}
                        </el-radio>
                    </el-radio-group>
                    <el-input v-model="personInput"></el-input>
                </template>

                <template v-else-if="item.type == 'quick'">
                    <el-radio-group v-model="quickRadio" @change="onQuickChange" v-if="item.child!.length" class="quick">
                        <el-radio v-for="(child, index) in item.child!" :label="child.name" :key="index">{{ child.name
                        }}
                        </el-radio>
                    </el-radio-group>
                </template>
                <el-input v-else-if="item.type == 'info'" type="textarea" v-model="form.info" @input="onDescribeInput" />
                <el-input v-else-if="item.type == 'input'" type="input" />
                <template v-else-if="item.type == 'endTime'">
                    <el-date-picker placeholder="请选择日期" :validate-event="false" value-format="YYYY-MM-DD" />
                    <el-time-select step="00:15" start="8:00" end="21:00" placeholder="请选择时间" />
                </template>

            </el-form-item>

        </template>



    </el-form>
</template>

<script setup lang="ts">
import orderInput from "global@/orderInput/index.vue";
import uploadFile from "global@/uploadFile/index.vue";

import type { FormInstance, } from 'element-plus'

import { pinyin } from "pinyin-pro";
import to from "await-to-js";
import { uploadImg } from "@/api"
import { ElMessage } from 'element-plus'
import { workCreate, getGropuForm, workEdit } from "@/api"
import { getUserName } from "@/store/user"



type items = {
    /** 类型 */
    type: string,
    /** 标签名字 */
    label: string,
    /** 验证 */
    prop?: string,
    /** 是否必填 */
    required?: boolean,

    /** 要绑定的属性 */
    model?: any,

    /** 子渲染，多选框或者单选框的时候用的 */
    child?: {
        id: number,
        name: string
    }[]
}[]

const Props = defineProps<{
    formItem: items,
    group: number | string
}>();


let fileLength = $ref(0);
let quickRadio = $ref<string | undefined>();

let form = $ref({
    group: "",
    /** 订单号 */
    order: "",
    /** 是否紧急 */
    tight: false,
    /** 详细信息 */
    info: "",
    /** 文件url */
    file: [] as string[] ,
    /** 数量 */
    pcs: -1,
    /** 结束时间 */
    endtime: "",
    /** 责任人 */
    person: "",
    /** 是否评判 */
    is_eva: false
});
const uploadEl = $ref<InstanceType<typeof uploadFile>[]>();
const dataForm = $ref<FormInstance>();

let action = "add";
let originData: any;

let soreLength = $ref(0);
let personInput = $ref("");

const rulesList: {
    [key: string]: any
} = {
    "order": [{ required: true, message: '请填写订单号', trigger: 'change' }],
    "upload": [{
        validator(a: any, b: any, callback: any) {
            if (fileLength == 0) {
                callback(new Error("请选择上传图片"));
                return;
            }
            callback();
        }, trigger: 'change'
    }],
    "info": [{ required: true, message: '请填写详细描述', trigger: 'change' }],
}


function sorePerson(perArr: any[]) {

    if (soreLength == 0) {
        soreLength += 1;

        return [...perArr].sort((a: any, b: any) => {

            const aName = pinyin(a.name, { toneType: 'none' });
            const bName = pinyin(b.name, { toneType: 'none' });

            return aName.charCodeAt(0) - bName.charCodeAt(0)
        })

    } else {
        return perArr;
    }

}



const rules = $computed(() => {
    const retVal: any = {};

    Props.formItem.forEach((item) => {
        if (rulesList[item.type] && item.required) {
            retVal[item.type] = rulesList[item.type]
        }
    })
    return retVal;
})


function onQuickChange(value: string) {
    form.info = value;
}
function onDescribeInput() {
    quickRadio = undefined;
}

async function sendImg() {


    const [el] = uploadEl;


    const [err, result] = await to(el.uploadFile()) as any;

    if (err) {
        throw err;
    }


    return result as string[];

    // const [err, result] = await to(uploadEl[0].getFile()) as any;
    // if (err) {
    //     throw err;
    // }
    // if (typeof result === "string") {
    //     return result
    // }


    // const { src, file } = result;





    // const sendImg = new FormData();
    // sendImg.append("file", (result as any).file[0], "file.jpg");
    // const [uploadErr, uploadResult] = await to(uploadImg(sendImg));
    // if (uploadErr) {
    //     ElMessage.error((uploadErr as any).msg || uploadErr.message || "上传图片失败，请稍后重试")
    //     throw uploadErr;
    // } else {
    //     return uploadResult;
    // }

}

async function onSubmit() {

    await dataForm.validate();

    


    try {

        if (uploadEl && fileLength >= 1) {
            form.file = await sendImg()
        }
    } catch (error: any) {
        ElMessage.error(error.message || "图片上传失败，请联系管理员")
        throw error;
    }


    form.group = `${Props.group}`;

    let error;
    if (action == "add") {
        [error] = await workCreate(form as any);
    } else {
        [error] = await workEdit(originData.id, form as any);
    }

    if (error) {
        ElMessage.error((error as any).msg || error.message || "提交失败，请重试")
        throw error;
    }

}

function setFormData(data: any) {

    action = "edit";
    originData = data;

    data.file = data.imgfile;

    delete data.imgfile;



    data.person = parseInt(data.person);
    Object.assign(form, data);

}

watch(() => uploadEl, (value) => {
    
    if (value) {
        value[0].setFile(form.file)
    }
})

watch($$(personInput), (value) => {
    form.person = value;
})



defineExpose({
    onSubmit,
    setFormData
})





</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.person,
.quick {
    label {
        margin-right: 20px;
    }
}

.person {
    margin-right: 20px;

    &+.el-input {
        width: 80px;

    }
}
</style>
