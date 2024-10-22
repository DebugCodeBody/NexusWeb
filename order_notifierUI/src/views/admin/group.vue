<template>
    <pop-dialog v-model="show" :title="`${add ? '添加' : '编辑'}群`" style="width: 30%;" @confirm="confirm" @cancel="cancel"
        ref="Dialog">

        <div class="group-view">
            <div class="group-top">
                <el-form :model="form" label-width="auto" :rules="rules" :hide-required-asterisk="true" ref="formEl">
                    <el-form-item label="群名" prop="name">
                        <el-input v-model="form.name" />
                    </el-form-item>
                    <el-form-item label="高亮" @click="onColorClick">
                        <el-color-picker v-model="form.color" :predefine="predefineColors" @change="onColorChange"
                            @active-change="onColorChange" ref="colorPickerEl" />
                    </el-form-item>
                    <el-form-item label="允许撤回" @click="onColorClick">
                        <el-switch v-model="form.is_withdraw" inline-prompt active-text="是" inactive-text="否" />
                    </el-form-item>
                    <el-form-item label="禁用" @click="onColorClick">
                        <el-switch v-model="form.disabled" inline-prompt active-text="是" inactive-text="否" />
                    </el-form-item>
                    <el-form-item label="回复类型" @click="onColorClick">
                        <el-radio-group v-model="form.response_type">
                            <el-radio :label="1">群机器人</el-radio>
                            <el-radio :label="2">工作台机器人</el-radio>
                            <el-radio :label="3">不回复</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="机器人" prop="hook">
                        <el-input v-model="form.hook" type="textarea" />
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </pop-dialog>
</template>

<script setup lang="ts">
import to from "await-to-js";
import type { FormInstance, FormRules } from 'element-plus'

import popDialog from "global@/popDialog/index.vue"


const Emit = defineEmits<{
    (e: 'update:show', value: boolean): void;
    (e: 'addAction', value: any): void;
    (e: 'editAction', value: any): void;
}>();

const Props = defineProps<{
    form?: GroupInfo,
    add: boolean,
    show?: boolean
}>();


let formEl = $ref<FormInstance>();
let colorPickerEl = $ref();
let Dialog = $ref<InstanceType<typeof popDialog>>();
let show = $ref(true);


const predefineColors = ref([
    'rgb(0,137,255)',
    'rgb(0,176,66)',
    'rgb(111,146,0)',
    'rgb(255,146,0)',
    'rgb(227,73,134)',
    'rgb(185,99,211)',
    'rgb(227,172,26)',
    'rgb(136,77,49)',
    'rgb(211,63,14)',
])
const form = reactive({
    id: 0,
    /** 群名 */
    name: "",
    /** 机器人链接 */
    hook: "",
    /** 机器人链接 */
    title: "",
    /** 高亮 */
    color: "",
    is_withdraw: false,
    disabled: false,
    response_type: 2
})
const rules = reactive({
    name: [{ required: true, message: '请填写群名', trigger: 'change' }],
    title: [{ required: true, message: '请填写移动端登记展示标题', trigger: 'change' }],
    hook: [{ validator: formValidURL, trigger: 'change' }],
})


function onColorChange(val: string) {
    // console.log(val);
}

function onColorClick() {
    // nextTick(() => {
    //     setTimeout(() => {
    //         const selectorInput = document.querySelectorAll(".el-popper .el-color-dropdown__btns .el-input input");
    //         const findInput = [].find.call(selectorInput, (elem: HTMLElement) => {
    //             return elem.clientWidth > 0;
    //         })

    //         if (findInput) {

    //         }

    //     }, 100)
    // })
}


async function confirm() {
    let [err, result] = await to(formEl.validate());
    if (err) {
        return;
    }

    Dialog.startSubmit();

    const { name, hook } = form;

    if (Props.add) {
        Emit('addAction', form)
    } else {
        Emit('editAction', form)
    }


    Dialog.close();


}

function cancel() {
    Emit("update:show", false);
}

function init() {
    if (!Props.add) {
        form.name = Props.form!.name;
        form.hook = Props.form!.hook;
        form.id = Props.form!.id;
        form.color = Props.form!.color;
        form.response_type = Props.form!.response_type;
        form.is_withdraw = Props.form!.is_withdraw;
        form.disabled = Props.form!.disabled;
    }

}


init();


function formValidURL(rule: any, value: any, callback: any) {
    if(form.response_type == 3){
        callback()
    }else if (value === '') {
        callback(new Error('请填写机器人链接'))
    } else if (!validURL(form.hook)) {
        callback(new Error("机器人链接格式有误，请重新输入"))
    } else {
        callback()
    }
}

function validURL(url: string) {
    let reg;
    if (process.env.NODE_ENV == 'production') {
        reg = /^https:\/\/oapi.dingtalk.com\/robot\/send\?access_token=[a-zA-z\d]{64}/
    } else {
        reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    }


    return reg.test(url)
}


onMounted(() => {
})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.group_dialog {
    width: 30%;
}

.group-view {

    .group-bottom {
        display: flex;

        button {
            flex: 1
        }
    }

    textarea {
        height: 100px;
    }
}
</style>
