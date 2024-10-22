<template>
    <div id="declare">
        <h3 class="declare_header title">{{ title }}</h3>
        <el-form label-width="80px" :model="ruleForm" :rules="formRules" ref="ruleFormRef"
            :hide-required-asterisk="true">
            <el-form-item label="申报人员" prop="name">
                <el-input v-model="ruleForm.name" disabled />
            </el-form-item>

            <el-form-item label="采购商品" prop="barcode">
                <el-input v-model="ruleForm.barcode" />
            </el-form-item>

            <el-form-item label="采购数量" prop="num">
                <el-input-number v-model="ruleForm.num" :min="1" size="large" :validate-event="false" />
            </el-form-item>
            <el-form-item label="是否急用">
                <el-switch v-model="ruleForm.tight" inline-prompt active-text="是" inactive-text="否" />
            </el-form-item>

            <el-form-item label="详细图片" class="upload">
                <imgUpload ref="update" />
                <div class="paste-img" :class="{ 'is-img': isImg }" v-if="!isImg">
                    <el-button @click="onPaste">粘贴图片</el-button>
                </div>

            </el-form-item>

            <el-form-item label="详细描述" ref="describe" prop="describe">
                <el-input v-model="ruleForm.describe" type="textarea" ref="textarea"></el-input>
            </el-form-item>

            <el-result icon="success" sub-title="提交成功" v-if="submitDone"></el-result>
        </el-form>

        <div class="fun-area" v-if="!submitDone">
            <!-- <template v-if="!updateDisabled">
                <el-button @click="onUpload" v-if="mobile">上传图片</el-button>
                <el-button @click="onPaste" v-else>粘贴图片</el-button>
            </template> -->
            <el-button @click="onSubmit" :loading="loading">{{ loading && "正在" || "" }}提交</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import imgUpload from "./components/imgUpload.vue"
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"


import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, UploadRawFile, UploadUserFile } from 'element-plus'

import formRules from "./store/formRules"
import { getUserName } from "@/store/user"
import { ruleForm, updateDisabled, submitDone, fileList } from "./store/data"

import { submit } from "@/api"
import { zipImg } from "@/utils/other";



const isImg = computed(() => {
    return fileList.value.length > 0;
})

const mobile = !['notInDingTalk', 'pc'].includes(window.dd.env.platform);
const ruleFormRef = ref<FormInstance>();
const loading = ref(false);




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


        const raw = img as UploadRawFile;

        raw.uid = Math.random();
        updateImg.raw = raw;

        fileList.value.push(updateImg);

    } catch (error) {
        ElMessage.error("剪辑板没有图片")
    }
}

function onUpload() {
    document.querySelector<HTMLElement>("#declare .el-upload__input")!.click();
}


async function onSubmit() {
    if (!ruleFormRef.value) return;

    try {
        await ruleFormRef.value.validate();
    } catch (err) {
        return;
    }

    try {
        let file;
        const imgFile = fileList.value[0];
        if (imgFile) {
            file = await zipImg(imgFile.raw as File);
        }


        // // img.size = imgFile.size!;
        // // img.format = imgFile.raw!.type;
        // // img.resolution = await getImageSize(imgFile.url!);


        // // imgZip.size = file.size!;
        // // imgZip.format = img.format;
        // // imgZip.resolution = img.resolution;

        const sendForm = new FormData();

        sendForm.append("name", ruleForm.name);
        sendForm.append("num", ruleForm.num + "");
        sendForm.append("barcode", ruleForm.barcode);
        sendForm.append("tight", String(ruleForm.tight));
        if (ruleForm.describe != String.Empty) {
            sendForm.append("describe", ruleForm.describe);
        }
        if (file) {
            sendForm.append("file", file, imgFile.name);
        }


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


onMounted(() => {
    ruleForm.name = getUserName();
})


</script>

<script lang="ts">
const title = "采购申请";


export default {
    name: "",
    title
}
</script>

<style lang="scss">
#declare {
    position: relative;
    height: 100%;

    padding: 10px;
    padding-top: 10px;
    max-width: 800px;
    padding-bottom: 20px;
    margin: auto;

    display: flex;
    flex-direction: column;
    box-sizing: border-box;


    .el-input__inner[disabled] {

        color: #999 !important;
        -webkit-text-fill-color: #999 !important;
        opacity: 1 !important;

    }

    .declare_header.title {
        height: 50px;
        line-height: 50px;
        text-align: center;
        color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        background-color: rgb(102, 177, 255);
    }

    form {
        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: relative;
        padding: 10px;

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }
    }

    .fun-area {
        .el-button {
            margin: auto;
            display: inherit;
            margin-top: 20px;
            width: 100%;
            height: 100%;
        }
    }


    .upload {

        .el-upload,
        .el-upload-list__item-actions,
        .el-upload-list li {
            height: 80px;
            width: 80px;
            line-height: 80px;
        }

        .el-icon-plus {
            font-size: 20px;
        }

        #elUpload {
            display: flex;
            margin-right: 10px;
        }

        .paste-img {
            height: 80px;
            width: 80px;
            border-radius: 6px;
            cursor: pointer;

            .el-button {
                width: 100%;
                height: 100%;
            }
        }

        .is-img {
            margin: 0 8px 8px 0;
        }


    }

    textarea {
        height: 100px;
        resize: none;
    }

    .el-result {
        z-index: 999;
    }


}
</style>
