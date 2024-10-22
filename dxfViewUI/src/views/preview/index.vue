<template>
    <div id="order">
        <el-form>
            <el-form-item label="文件编号" class="id-view">
                <el-input v-model="viewId" placeholder="文件编号" />
                <el-button @click="onDetermine" type="primary" :disabled="!viewId">确定</el-button>
            </el-form-item>
            <el-form-item label="文件名称">
                <el-input v-model="name" />
            </el-form-item>
            <div id="cad-view" ref="cadView">

            </div>
        </el-form>
        <el-button @click="onOpenDxf" style="margin-top: 20px;" v-if="debug">打开文件</el-button>
    </div>
</template>

<script setup lang="ts">
import { useCurrentElement, useFileDialog } from "@vueuse/core"

import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { getKey } from "@/utils/urlSearch"
import { getJson } from "@/api"

import { ElMessage } from 'element-plus'


const { files, open, reset } = useFileDialog()
const viewId = ref(String.Empty);
const name = ref(String.Empty);

let height = 0;
let width = 0;
const debug = process.env.NODE_ENV != "production"
const cadView = ref<HTMLElement>();
const parser = new window.DxfParser();
let fontLoader: any = null;

/**
 * 加载字体JSON
 */
new window.THREE.FontLoader().load("https://unpkg.com/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json", (data: any) => {
    fontLoader = data;
})


watch(files, (value) => {
    if (!value || value!.length == 0) {
        return;
    }
    const [dxf] = value!;

    try {
        if (dxf.name.split(".")[1] != "dxf") {
            throw "error";
        }
    } catch {
        ElMessage.error("仅支持DXF文件");
        return;
    }

    dxf.text().then((text) => {

        renderDxf(parser.parseSync(text));

    });

})



function onOpenDxf() {
    reset();
    open({
        accept: ".dxf"
    });
}

function renderDxf(parserText: string) {

    const { value: canvas } = cadView;

    if (canvas!.childNodes.length > 0) {
        canvas!.removeChild(canvas!.childNodes[0])
    }

    try {
        const dxfView = new window.ThreeDxf.Viewer(parserText, canvas, width, height, fontLoader);
        dxfView.render();
    } catch (error) {
        ElMessage.error("文件渲染失败");
    }

}


async function onDetermine() {
    try {
        const result = await getJson(viewId.value);

        name.value = result.name;

        renderDxf(result.data)

    } catch (err) {
        ElMessage.error("文件打开失败");
    }

}




onMounted(() => {
    const view = document.querySelector<HTMLElement>("#order form")!;

    width = cadView.value!.offsetWidth;
    height = (window.innerHeight - view.offsetHeight - 40) ;


    const id = getKey("id");
    viewId.value = id;

    if (id) {
        onDetermine();
    }

})


</script>

<script lang="ts">
export default {
    name: "",
    title: "dxf面板"
}
</script>

<style lang="scss">
#order {
    position: relative;
    height: 100%;

    padding: 10px;
    padding-top: 10px;
    padding-bottom: 20px;
    margin: auto;

    display: flex;
    flex-direction: column;


    .id-view {
        .el-input {
            flex: 1;
        }

        button {
            margin-left: 10px;
        }
    }

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
        box-sizing: border-box;
    }

    .el-image {
        &>img {
            margin-bottom: 10px;
            cursor: pointer;
        }
    }

    .el-image-viewer__canvas {
        cursor: pointer;
    }


}
</style>
