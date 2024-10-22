<template>
    <div class="quotes-editor w-full">

        <div class="page-top-container flex ">
            <el-link type="primary" @click="onClickReturn">返回我的报价页</el-link>
        </div>

        <div class="quote-page-container ">
            <div class="quote-page-box mb-10px">
                <div>

                </div>
                <div class="radio-content">
                    <radio-list class="material-radio" title="材质" v-model="materialRadio" @change="onUpdate" />
                    <radio-list class="count-radio" title="数量" v-model="countRadio" @change="onUpdate" />
                </div>
            </div>
            <div class="quote-details-list-container">
                <div class="head">
                    <p>信息编辑</p>
                </div>
                <div class="flex info flex-col">
                    <div class="info-head">
                        <div class="file-name">
                            <span>{{ modelItem.name }}</span>
                        </div>
                        <div class="">
                            <div class="flex">

                                <div class="material-box mr-10px">
                                    <span>材质：</span>
                                    <div class="flex-1">
                                        <el-input v-model="inputMaterial" :disabled="materialDisabled"
                                            @change="onUpdate"></el-input>
                                    </div>
                                </div>
                                <div class="qty-box">
                                    <span>数量：</span>
                                    <div class="flex-1">
                                        <el-input v-model="inputCount" :disabled="countDisabled"
                                            @change="onUpdate"></el-input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-16px">
                        <div class="img border">

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import radioList from "./radio.vue"
import { createInputDisabled, getInputValue } from "./Helper"


const Props = defineProps<{
    modelItem: workPieceItem
}>();


const previousData = {
    ...Props.modelItem
}


const Route = useRoute();
const Router = useRouter();


let countRadio = $ref(Props.modelItem.count);
let materialRadio = $ref(Props.modelItem.material);

const countDisabled = createInputDisabled($$(countRadio));
const materialDisabled = createInputDisabled($$(materialRadio));

let inputCount = $ref(getInputValue(Props.modelItem.count));
let inputMaterial = $ref(getInputValue(Props.modelItem.material));


function onUpdate() {
    updateModel(Props.modelItem);
}

function updateModel(data: workPieceItem) {
    data.count = countDisabled.value ? countRadio : inputCount;
    data.material = materialDisabled.value ? materialRadio : inputMaterial;
}


function onClickReturn() {
    Router.go(-1)
}

onUnmounted(() => {

    const data = Props.modelItem as any;

    if (!countDisabled.value && !inputCount) {
        data.count = previousData.count
    }
    if (!materialDisabled.value && !inputMaterial) {
        data.material = previousData.material
    }


})





</script>

<script lang="ts">
export default {
    name: ""
}
</script>


<style lang="scss">
.quotes-editor {

    .page-top-container {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin: 16px 0;
    }

    .quote-page-box {
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
        margin-bottom: 8px;
    }


    .quote-details-list-container {
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
        margin-bottom: 8px;

        .head {
            border-bottom: 1px solid #d0d7dd;
            padding: 11px 16px;

            p {
                font-size: 16px;
                font-weight: 700;
                line-height: 22px;
                margin: 0;
            }
        }

        .info {
            padding: 11px 16px;

            .info-head {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .file-name {
                    color: #253843;
                    display: inline-block;
                    font-size: 14px;
                    font-weight: 600;
                    font-weight: 700;
                    line-height: 19px;
                    max-width: 190px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    vertical-align: top;
                    white-space: nowrap;
                    word-break: break-all;
                }

                .qty-box,
                .material-box {



                    display: flex;
                    align-items: center;

                    span {
                        color: #45505a;
                        display: inline-block;
                        font-size: 13px;
                        font-weight: 700;
                        line-height: 18px;
                        line-height: 28px;
                    }

                    .el-input {
                        max-width: 120px;
                    }
                }
            }



            .img {
                width: 98px;
                height: 98px;
            }
        }

    }

    .radio-content {
        padding: 11px 16px;
    }


}
</style>
