<template>
    <div id="declare">
        <h3 class="declare_header title">催单登记</h3>
        <el-form :model="ruleForm" ref="workForm" :rules="ruleRules" :hide-required-asterisk="true">

            <el-form-item label="登记人员" prop="name">
                <el-input v-model="ruleForm.name" disabled />
            </el-form-item>

            <el-form-item label="工单单号" prop="order" class="charge-order">
                <select-order v-model="ruleForm.order" />
                <el-button type="primary" @click="onClickScann">扫描</el-button>
            </el-form-item>
            <el-form-item label="工单条码" prop="barcode" class="charge-order" v-if="false">
                <el-input v-model="ruleForm.barcode" />
                <el-button type="primary" @click="onClickScann">扫描</el-button>
            </el-form-item>

            <el-form-item label="负责部门" prop="branch" class="charge-barnch">
                <el-input v-model="selectName" placeholder="选择部门" disabled />
                <el-button type="primary" @click="branchSwitch(undefined)">选择</el-button>
            </el-form-item>

            <el-form-item label="负责人员" prop="person" class="charge-person" v-if="false">
                <el-radio-group v-model="ruleForm.person" v-if="selectBranch.incharge">
                    <el-radio :label="name" size="default" v-for="(name, index) in selectBranch.incharge" :key="index">{{name}}</el-radio>
                </el-radio-group>
                <el-tag type="danger" v-else>请先选择负责部门</el-tag>
            </el-form-item>

            <el-form-item label="详细描述" ref="describe" prop="describe" id="describe">
                <el-input v-model="ruleForm.describe" type="textarea" ref="textarea"></el-input>
            </el-form-item>
            <el-result icon="success" sub-title="提交成功" v-if="submitDone"></el-result>
        </el-form>
        <div class="footer" v-if="!submitDone">
            <el-button @click="onClickSubmit">提交</el-button>
        </div>

        <Branch class="charge-branch" />
    </div>
</template>

<script setup lang="ts">
import Branch from "@/components/Branch/index.vue"
import selectOrder from "./components/selectOrder.vue"


import { useCurrentElement, watchDebounced } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage } from 'element-plus'


import { ruleForm, ruleRules } from "./store/form"
import { branchSwitch, selectBranch, selectName, branchInit } from "@/store/branch"
import { scanning } from "@/utils/other";
import { submit, moidAndOrderid } from "@/api"

import { getUserName } from "@/utils/auto";


const workForm = ref();
const submitDone = ref(false);

/**
 * 二维码扫描按钮
 */
async function onClickScann() {
    try {
        if (process.env.NODE_ENV == "production") {
            ruleForm.barcode = await scanning();
        } else {
            try {
                ruleForm.barcode = await scanning();
            } catch {
                ruleForm.barcode = "347743";
            }
        }

    } catch (err: scanError) {
        if (err.code != 10) {
            console.log("扫描错误");
        }
        return;
    }

    try {
        ruleForm.order = await moidAndOrderid(ruleForm.barcode);
    } catch (error) {
        console.log(error);
    }

}

/**
 * 显示部门用的字符串
 */
watch(selectBranch, (value) => {
    ruleForm.branch = selectName.value
    ruleForm.person = value.incharge[0];
})

async function onClickSubmit() {
    try {
        await workForm.value.validate();
    } catch {
        return;
    }

    try {

        const { deptname } = selectBranch.value;

        const { name, describe, order, barcode, branch } = ruleForm;
        await submit(name, order, barcode, deptname, describe);

        submitDone.value = true;

    } catch (error: any) {
        ElMessage.error(error.msg || error.message || "提交失败，请重试");
    }

}

onMounted(() => {
    ruleForm.name = getUserName();
})

branchInit();

</script>

<script lang="ts">
export default {
    name: ""
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

        .charge-order,
        .charge-barnch {
            .el-form-item__content {
                &>:first-child {
                    flex: 1;
                }

                .el-button {
                    margin-left: 10px;
                }
            }
        }

        #describe {
            textarea {
                height: 100px;
                resize: none;
            }
        }

        .el-form-item.charge-person {
            align-items: center;
        }

        .el-input__inner[disabled] {

            color: #999 !important;
            -webkit-text-fill-color: #999 !important;
            opacity: 1 !important;

        }

    }

    .charge-branch {

        box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
        position: absolute;
    }


    .footer {
        margin-top: 20px;

        button {
            width: 100%;

            height: 50px;
        }

    }


}

.el-cascader-menu {
    min-width: 120px !important;
}
</style>
