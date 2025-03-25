<template>
    <div class="flex justify-center items-center document-wrapper ">

        <el-card class="box-card h-full">
            <div class="box-content">
                <div class="header">
                    <div class="wh-full flex header-table">
                        <div class="w-full flex">
                            <div class="flex-1">
                                <el-input v-model="id" :disabled="loading"></el-input>
                            </div>
                            <div class="ml-10px">
                                <el-button type="primary" :disabled="!id" :loading="loading"
                                    @click="onClickQuery">查询</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main">
                    <div class="p-10px border">
                        <el-form label-width="auto" :hide-required-asterisk="true">
                            <el-form-item label="标题：">
                                <span>{{ Description.title }}</span>
                            </el-form-item>
                            <el-form-item label="创建时间：">
                                <span>{{ Description.create_time }}</span>
                            </el-form-item>
                            <el-form-item label="适用人员：">
                                <span>{{ Description.fit_range }}</span>
                            </el-form-item>
                            <el-form-item label="描述：">
                                <span>{{ Description.aim }}</span>
                            </el-form-item>
                            <el-form-item label="文档：">
                                <el-button type="danger" size="small" v-if="isUpload">文件正在上传，请稍等</el-button>
                                <div v-else>
                                    <div v-for="(item, index) in page" :key="item">
                                        <el-link :href="getDocSrc(item)" target="_blank" type="primary">第 {{ index + 1 }}
                                            页</el-link>
                                    </div>
                                </div>
                            </el-form-item>

                        </el-form>
                    </div>
                </div>

            </div>
        </el-card>

    </div>
</template>

<script setup lang="ts">
import base64Img from "./img"
import to from "await-to-js";

import { Get } from "@/api"
import getSearch from "@/utils/urlSearch"


let loading = $ref(false);

const id = $ref(getSearch("id"));
const page = $ref<number[]>([]);


let uploadQuery: number;
let isUpload = $ref(false);
const Description = $ref<documentDesc>({} as documentDesc);

const imageSrcList = $computed(() => {
    const retVal = page.map((elem) => {
        return `/api/img/${id}/${elem}`
    });
    return retVal;
});


function onClickQuery() {
    init();
}

function getDocSrc(page: number) {
    return `${location.origin}/ding/nexus/oa/meeting/todoc/${id}/${page}`
}


async function init() {
    try {
        if (!id) {
            return;
        }

        if(uploadQuery > -1){
            clearTimeout(uploadQuery);
            uploadQuery = -1;
        }



        loading = true;
        let [err, result] = await to(Get(id));
        if (err) {
            return;
        }


        isUpload = result!.isUpload;
        page.splice(0, page.length, ...result!.page);
        Object.assign(Description, result!.desc);

        if (isUpload) {
            uploadQuery = window.setTimeout(() => {
                uploadQuery = -1;
                init();
            }, 1000)
        }

    } finally {
        loading = false;
    }


}


onMounted(() => {

    init();


})


</script>

<script lang="ts">
export default {
    name: "",
    title: "文档上传"
}
</script>

<style lang="scss">
.document-wrapper {

    .el-card__body {
        padding: 10px;
        box-sizing: border-box;
    }


    .title {
        font-weight: bolder;
    }

    .box-card {
        flex-basis: 1200px;

        .el-card__body {
            height: 100%;
        }


    }

    .box-content {
        display: flex;
        flex-direction: column;
        height: 100%;


        .main,
        .header,
        .footer {
            width: 100%;
        }

        // .header {
        //     height: 120px;
        // }

        .main {
            flex: 1;
        }

        .footer {
            display: flex;
            justify-content: space-between;
        }

    }

    .header-table {

        .file {
            border-right: 1px solid black;
        }


        .info {
            .item {

                flex: 1;
                text-align: center;
                border-bottom: 1px solid black;

                &:last-child {
                    border: 0;
                }


                .cloumn {
                    height: 100%;
                    display: flex;
                }

                .name,
                .value {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    justify-content: center;
                }

                .name {
                    width: 80px;
                    border-right: 1px solid black;
                }

                .value {
                    flex: 1;
                    text-align: center;
                }




            }


        }

    }

    .main {
        padding: 10px 0;
        box-sizing: border-box;
        overflow: hidden;


        .img-list {
            border: 1px solid black;
        }


        img {
            width: 100%;
            height: 100%;
        }
    }



}
</style>
