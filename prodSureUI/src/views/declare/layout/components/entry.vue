<template>
    <el-form label-width="80px" :model="ruleForm" :rules="formRules" ref="ruleFormRef">
        <el-form-item label="申报人员" prop="name">
            <el-input v-model="ruleForm.name" disabled />
            <overlay :show="true" />
        </el-form-item>

        <el-form-item label="工单单号" prop="barcode">
            <div class="scan-content">
                <template v-if="!isout" >
                    <select-order v-model="ruleForm.barcode" />
                    <el-button type="primary" @click="onClickScann">扫描</el-button>
                </template>
                <el-input v-model="ruleForm.barcode" placeholder="请输入工单号" v-else />
            </div>
        </el-form-item>

        <el-form-item label="工单照片" class="upload">
            <imgUpload ref="update" />
        </el-form-item>

        <el-form-item label="是否上机" class="upload">
            <el-checkbox v-model="honour" size="large" border />
        </el-form-item>

        <el-form-item label="详细描述" ref="describe" prop="describe">
            <el-input v-model="ruleForm.describe" type="textarea" ref="textarea"></el-input>
        </el-form-item>



        <!-- <el-form-item label="图片描述" ref="describe" prop="describe">
                <p>图片大小：{{ img.size }}</p>
                <p>图片尺寸：{{ img.resolution.width }} * {{ img.resolution.height }}</p>
                <p>图片格式：{{ img.format }}</p>
            </el-form-item>
            <el-form-item label="压缩描述" ref="describe" prop="describe">
                <p>图片大小：{{ imgZip.size }}</p>
                <p>图片尺寸：{{ img.resolution.width }} * {{ img.resolution.height }}</p>
                <p>图片格式：{{ imgZip.format }}</p>
        </el-form-item> -->

        <el-result icon="success" sub-title="提交成功" v-if="submitDone"></el-result>
    </el-form>


    <div class="fun-area" v-if="!submitDone">

        <template v-if="!updateDisabled">
            <el-button @click="onUpload" v-if="mobile">上传图片</el-button>
            <el-button @click="onPaste" v-else>粘贴图片</el-button>
        </template>

        <el-button @click="onSubmit" v-else :loading="loading">{{  loading && "正在" || ""  }}提交</el-button>
    </div>
</template>

<script setup lang="ts">
import imgUpload from "./imgUpload.vue"
import overlay from "@/components/overlay.vue"
import selectOrder from "./selectOrder.vue"


import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadRawFile, UploadUserFile } from 'element-plus'

import { submit, moidAndOrderid } from "@/api"
import { zipImg, getImageSize, scanning } from "@/utils/other"
import { getUserId, getUserName } from "@/utils/auto"
import { ruleForm, updateDisabled, submitDone, fileList, mobile } from "../hooks/data"



import formRules from "../hooks/formRules"

const stepShow = ref(false)


// const img = reactive({
//     size:0,
//     resolution:  {
//         width: 0,
//         height: 0
//     }, 
//     format: ""
// });
// const imgZip = reactive({
//     size:0,
//     resolution: {
//         width: 0,
//         height: 0
//     }, 
//     format: ""
// });


type scanResult = {
    text: string
};

const update = ref();
const ruleFormRef = ref<FormInstance>()

const isout = ref(window.urlSearch.user == "58ca25f21ac0c6e7b5267c9453975140")


const honour = ref(false);
const loading = ref(false);
let barcode = String.Empty;


/**
 * 二维码扫描按钮
 */
async function onClickScann() {

    try {
        barcode = await scanning();
    } catch (err: unknown) {
        if (process.env.NODE_ENV == "production") {
            return;
        } else {
            barcode = "347743";
        }
    }

    try {
        ruleForm.barcode = await moidAndOrderid(barcode);
    } catch (error) {
        console.log(error);
    }

}

function onUpload() {
    (document.querySelector("#declare .el-upload__input") as HTMLElement).click();
}

async function onSubmit() {
    if (!ruleFormRef.value) return;

    try {
        await ruleFormRef.value.validate();
        await ElMessageBox.confirm('确定是否提交', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        })

    } catch (err) {
        return;
    }

    try {
        const imgFile = fileList.value[0];
        const file = await zipImg(imgFile.raw as File);


        // img.size = imgFile.size!;
        // img.format = imgFile.raw!.type;
        // img.resolution = await getImageSize(imgFile.url!);


        // imgZip.size = file.size!;
        // imgZip.format = img.format;
        // imgZip.resolution = img.resolution;

        const sendForm = new FormData();

        sendForm.append("userid", getUserId());
        sendForm.append("name", ruleForm.name);
        sendForm.append("honour", JSON.stringify(honour.value));
        sendForm.append("barcode", ruleForm.barcode);

        if (ruleForm.describe != String.Empty) {
            sendForm.append("describe", ruleForm.describe);
        }
        sendForm.append("file", file, imgFile.name);


        loading.value = true;
        await submit(sendForm);

        submitDone.value = true;
    } catch (err: any) {

        ElMessageBox.alert(`${err.msg || err.message || "未知错误,请重试"}`, '错误', {
            confirmButtonText: '确定',
            type: 'error',
            center: true
        })

    } finally {
        loading.value = false;
    }

}


async function onPaste(event: Event) {
    try {
        const [Item] = await navigator.clipboard.read();

        if (Item.types.indexOf('image/png') && Item.types.indexOf('image/jpg')) {
            throw Item;
        }



        const img = await Item.getType(Item.types[0])

        const updateImg: UploadUserFile = {} as UploadUserFile;

        updateImg.name = `${Date.now()}.${Item.types[0].split("/")[1]}`;
        updateImg.url = window.URL.createObjectURL(img);
        updateImg.raw = img as any;

        fileList.value.push(updateImg);

    } catch (error) {
        ElMessage.error("剪辑板没有图片")
    }

}

onMounted(() => {
    ruleForm.name = getUserName();
})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
</style>
