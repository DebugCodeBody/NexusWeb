<template>
    <el-dialog @closed="closed" v-model="dialogShow" custom-class="next-dia">
        <el-card>
            <div class="process">
                <work-steps></work-steps>
            </div>
        </el-card>
        <el-card>
            <div class="process">
                <label>操作步骤：</label>
                <el-radio-group v-model="nextProcess">
                    <el-radio label="2" size="large">转部门</el-radio>
                    <el-radio label="3" size="large">结案</el-radio>
                    <el-radio label="99" size="large">留言</el-radio>
                </el-radio-group>
            </div>
        </el-card>
        <el-card v-if="nextProcess == '2' && selectName != String.Empty">
            <div class="process">
                <label>转移部门：</label>
                <el-tag type="info">{{ selectName }}</el-tag>
                <el-button type="primary" size="default" style="margin-left: 10px;" @click="branchSwitch()">选择部门
                </el-button>

            </div>
        </el-card>
        <el-card>
            <div class="process describe">
                <label>详细描述：</label>
                <el-input v-model="describe" type="textarea" ref="textarea"></el-input>
            </div>
        </el-card>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeShow">取消</el-button>
                <el-popover v-model:visible="visible" :disabled="disabled" placement="top" :width="160" trigger="click">
                    <p>请先选择操作步骤！</p>
                    <template #reference>
                        <el-button type="primary" @click="onConfirm">确定</el-button>
                    </template>
                </el-popover>
            </span>
        </template>


        <el-dialog v-model="branchDrawer" custom-class="move-branch">
            <branch class="branch-dialog" />
        </el-dialog>
    </el-dialog>
</template>

<script setup lang="ts">
import workSteps from "./workSteps.vue"
import Branch from "@/components/Branch/index.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { ElMessage } from 'element-plus'


import { getStep, nextProcess } from "../store/step"
import { selectItem, allItem, selectType } from "../store/data"
import { branchSwitch, selectBranch, branchDrawer, selectName, branchInit } from "@/store/branch"

import { doneProblem, moveBranch, problemMessage } from "@/api"

const Emits = defineEmits(["close"]);

const visible = ref(false);
const disabled = ref(true);

const dialogShow = ref(true);
const describe = ref(String.Empty);

watch(nextProcess, (value) => {
    if (value == "2" && selectName.value == String.Empty) {
        branchSwitch();
    }
})

watch(branchDrawer, (value) => {
    nextTick(() => {
        if (!value && selectName.value == String.Empty) {
            nextProcess.value = String.Empty;
        }
    })
})


function closed() {
    Emits("close");
}

function closeShow() {
    dialogShow.value = false;
}

function deleTask() {
    const { value: type } = selectType;
    const { value: item } = selectItem;


    const index = allItem[type].findIndex((elem) => elem == item);
    if (index > -1) {
        allItem[type].splice(index, 1);
    }

}


async function onConfirm() {
    const { value } = nextProcess;
    if (value == String.Empty) {
        disabled.value = false;
        return;
    } else {
        disabled.value = true;
    }
    try {
        const { value: item } = selectItem;

        if (value == "2") {
            await move(item);
        } else if (value == "3") {
            await done(item);
        } else if (value == "99") {
            await message(item)
            closeShow();
            return;
        }

    } catch (error: any) {
        ElMessage.error(error.msg || error.message || "未知错误，请联系管理员");
        closeShow();
    }

}

async function move(item: task) {
    const { deptname } = selectBranch.value;
    if (deptname == "") {
        return
    }

    await moveBranch(item.expid, deptname, describe.value);
    if (selectType.value == "task") {
        deleTask();
    }
    closeShow();

}

async function done(item: task) {
    await doneProblem(item.expid, describe.value);
    deleTask();
    closeShow();
}

async function message(itme: task) {
    const result = await problemMessage(itme.expid, describe.value);

    result.memo = describe.value;

    getStep(itme).then((data) => {
        data.push(result);
    })


}


onUnmounted(() => {
    nextProcess.value = String.Empty;
    selectBranch.value = {} as branch;
})

branchInit();


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.next-dia {

    .el-card {
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0px;
        }

        .el-card__body {
            padding: 10px;
        }
    }


    .process {
        display: flex;
        align-items: center;

        &>label {
            margin-right: 10px;
        }

        &.describe {
            align-items: flex-start;

            .el-textarea {
                flex: 1;
            }

            textarea {
                height: 100px;
                resize: none;
            }



        }



    }

    .move-branch {
        position: relative;
        height: 60%;

        .branch-dialog {
            position: absolute;

        }

    }

}
</style>
