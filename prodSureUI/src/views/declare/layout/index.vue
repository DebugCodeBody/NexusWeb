<template>
    <div id="declare">
        <h3 class="title">工单问数</h3>

        <entry v-if="!isEndWork" />
        <endwork v-else />

    </div>
</template>

<script setup lang="ts">
import entry from "./components/entry.vue"
import endwork from "./components/endwork.vue"


import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"



const isEndWork = ref(window.urlSearch.path == "endwork")







</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.el-message-box {
    vertical-align: text-bottom !important;
    border: 0 !important;
}

#declare {
    padding: 10px;
    padding-top: 10px;
    max-width: 800px;
    padding-bottom: 20px;
    margin: auto;

    .overlay {
        opacity: 0;
    }

    .title {
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
        padding-top: 10px;
        padding-bottom: 10px;
        padding-right: 10px;
        position: relative;

        .el-result {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(255, 255, 255);
        }

        .el-input.is-disabled .el-input__wrapper {
            background-color: rgb(245, 247, 250);

            input {
                background-color: rgb(245, 247, 250);
                color: rgb(168, 171, 178);

            }
        }
    }

    .el-form-item__label::before {
        content: "";
    }

    .el-input.is-disabled .el-input__inner {
        background-color: white;
        color: #606266;
    }

    .el-radio-group {
      

        label {
            margin: 0px;
            margin-right: 5px;
            margin-bottom: 10px;
        }
    }

    .el-select {
        width: 100%;
    }


    .fun-area {
        .el-button {
            margin: auto;
            display: inherit;
            margin-top: 20px;
        }
    }

    .el-input__inner {
        padding: 0 5px;
    }

    .el-textarea__inner {
        padding: 5px;
    }

    textarea {
        height: 100px;
        resize: none;
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
    }

    .fun-area {
        width: 100%;
        height: 50px;
        background-color: white;
        border-radius: 5px;

        button {
            width: 100%;
            height: 100%;
        }

    }

    .scan-content {
        flex: 1;
        display: flex;

        .el-input {
            flex: 1;
        }

        .el-button {
            margin-left: 10px;
        }

    }

    .el-result {
        z-index: 999;
    }

    .el-form {
        padding: 10px;

        .el-card.box-card {
            margin-bottom: 10px;
        }
    }
}
</style>
