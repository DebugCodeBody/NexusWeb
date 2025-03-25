<template>
    <el-form :model="form" :hide-required-asterisk="true" :rules="rules" :label-width="70" ref="formEl">

        <slot name="after">
        </slot>

        <el-form-item label="单号" prop="orderid" v-show="!hidden">
            <div class="order-search-select">
                <el-select 
                    v-model="form.orderid" 
                    :filterable="true" 
                    ref="elSelectEl" 
                    @visible-change="onVisiblechange"
                    @blur="onSelectBlur" 
                    @change="onSelectChange" 
                    :disabled="inputDisabled">
                    <el-option v-for="(item) in form.autSndList" :key="item.orderid" :label="item.orderid"
                        :value="item.orderid">
                        <template #default>
                            <span class="orderid">{{ item.orderid }}</span>
                            <span class="custname">{{ item.custname }}</span>
                        </template>
                    </el-option>
                </el-select>
            </div>
        </el-form-item>

        
        <el-form-item label="客户名" v-if="!showSupplier">

            <el-tag type="danger" v-if="notOrder">未找到此订单</el-tag>
            <el-tag v-else-if="form.clientName">{{form.clientName}}</el-tag>
            <el-tag type="warning" v-else>请先选择单号</el-tag>
        </el-form-item>

        <el-form-item label="供货商" prop="supplier" v-if="showSupplier">
            <div class="order-search-select">
                <el-select v-model="form.supplier" :filterable="true" value-key="id">
                    <el-option v-for="(item) in form.supplierList" :key="item.id" :label="item.name" :value="item">
                        <template #default>
                            <span class="orderid">{{ item.name }}</span>
                            <span class="custname">{{ item.process }}</span>
                        </template>
                    </el-option>
                </el-select>
            </div>
        </el-form-item>


        <el-form-item label="类型" prop="type" v-show="false">
            <el-radio-group v-model="form.type" @change="onChageType">
                <el-radio v-for="item in typeArr" :key="item.lable" :label="item.lable" :value="item.lable"
                    :disabled="item.disabled"></el-radio>
            </el-radio-group>
        </el-form-item>

        <el-row class="mb-22px" :gutter="10" v-if="!isDisabledNum">
            <el-col :span="12">
                <el-form-item label="卡板" prop="pcnt">
                    <el-input-number v-model="form.pcnt" @change="onSizeInput" :min="0" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="铁桶" prop="bcnt">
                    <el-input-number v-model="form.bcnt" @change="onSizeInput" :min="0" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="金额" prop="amount">
            <el-input v-model="form.amount" type="number" class="amount-input" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="图片凭据" prop="fileLen" v-if="upload">
            <upload-file :height="80" :width="80" v-model="form.fileLen" ref="fileEl" />
        </el-form-item>

        <el-form-item label="备注" prop="mome">
            <el-input v-model="form.mome" type="textarea"></el-input>

            <template v-if="quickMome.length">
                <el-button v-for="item in quickMome" :key="item" class="mt-10px" @click="onClickQuickMome(item)">{{ item
                    }}</el-button>
            </template>

        </el-form-item>

        <el-input 
            v-model="newInputValue" 
            ref="newInputEl" 
            @input="onInput" 
            @blur="onInputBlur"
            :disabled="inputDisabled" />

    </el-form>
</template>

<script setup lang="ts">

import { ElForm, FormRules } from 'element-plus'

import { getAutSndList, getSupplier, getPltPayCfg , checkOrder} from "@/api"

import uploadFile from "global@/uploadFile/index.vue"
import { uploadImg } from "@/api/upload"
import { messageError } from "@/utils/elementLib"
import { debounce } from "@/utils/other"


import to from "await-to-js"





const Props = withDefaults(defineProps<{
    disabled?: boolean,
    order?: string,

    hidden?: boolean,
    /** 是否上传图片 */
    upload?: boolean,

    /** 备注快捷输入 */
    quickMome?: string[],

    requiredMome?: boolean,

    /** 是否显示供货商 */
    showSupplier?: boolean,

}>(), {
    disabled: false,
    hidden: false,
    order: "",
    quickMome: ([] as any),
    requiredMemo: false,

    showSupplier: false,
})


const typeArr = $ref([{
    lable: "卡板铁桶",
    disabled: false
}]);


const fileEl = $ref<InstanceType<typeof uploadFile>>();

/** 如果是跳转页面或者从钉钉应用点击，这个将不可以选择 */
if (!Props.disabled) {
    typeArr.push({
        lable: "其他",
        disabled: Props.disabled as any
    })
}


const amountTable = {
    "卡板": 30,
    "铁桶": 15,
    "其他": 0,

    /** 铁通单价 */
    bmon: 15,
    /** 卡板单价 */
    pmon: 30
}


const form = $ref({
    orderid: "",
    /** 卡板数量 */
    pcnt: 0,
    /** 铁桶数量 */
    bcnt: 0,
    amount: "" as string | number,
    mome: "",
    supplier: undefined as any as (undefined | supplier),
    type: typeArr[0].lable,

    autSndList: [] as autSnd[],
    supplierList: [] as supplier[],

    isDisabledNum: false,
    fileLen: 0,

    /** 客户名 */
    clientName: ""
});





let newInputValue = $ref("");
let elSelectEl = $ref<any>();
let selectHide = false;

/** 自定义输入框 */
let newInputEl = $ref<any>();

/** 是否没找到订单 */
let notOrder = $ref(false)


if (Props.order != "") {

    const { order } = Props as any;
    form.autSndList.push({
        orderid: order,
        custname: ""
    });
    form.orderid = order;
    newInputValue = order;

}



const formEl = $ref<typeof ElForm>();
const rules = reactive<FormRules>({
    orderid: [
        { required: true, message: '请填写工单号', trigger: 'change' },
        {

            validator(rule, value, callback, source, options) {

                let error: Error | undefined = undefined;
                if(notOrder){
                    error = new Error('未找到此订单');
                } else if (value != "无单号" && !(/^[A-Za-z]\d{4,}/.test(value))) {
                    error = new Error('请输入合法的工单号');
                }

                callback(error);

            }

        },
    ],
    type: [
        { required: true, message: '请选择类型', trigger: 'change' },
    ],
    pcnt: [
        {
            validator(rule, value, callback, source, options) {

                let error: Error | undefined = undefined;
                if (!totalSize) {
                    error = new Error("请填写卡板数量")
                }

                callback(error);

            },
            trigger: 'change'
        }
    ],
    bcnt: [
        {
            validator(rule, value, callback, source, options) {

                let error: Error | undefined = undefined;
                if (!totalSize) {
                    error = new Error("请填写铁桶数量")
                }

                callback(error);


            }, trigger: 'change'
        }
    ],

    // amount: [
    //     { required: true, message: '请填写金额', trigger: 'change' },
    //     {
    //         validator(rule, value, callback, source, options) {

    //             let error: Error | undefined = undefined;
    //             const amount = parseInt(`${form.amount}`);
    //             if (isNaN(amount) || amount <= 0) {
    //                 error = new Error("金额必须大于等于1")
    //             }

    //             callback(error);

    //         }, trigger: 'blur'
    //     },
    // ],

    mome: [
        { required: Props.requiredMome, message: '请填写备注', trigger: 'change' },

    ],
    supplier: [
        {
            validator(rule, value, callback, source, options) {
                let error: Error | undefined = undefined;
                if (!value) {
                    error = new Error("请选择供应商")
                }

                callback(error);

            }, trigger: 'change'
        },

    ]
});



const inputDisabled = computed(() => {
    return Props.disabled && !!Props.order
})


/** 单个金额 */
const singleAmount = $computed(() => {
    return form.pcnt * amountTable.pmon + form.bcnt * amountTable.bmon
});

const isDisabledNum = $computed(() => {

    form.isDisabledNum = form.type == "其他";

    return form.isDisabledNum;
})

const totalSize = $computed(() => {
    return form.pcnt + form.bcnt
})


function onClickQuickMome(value: string) {
    form.mome = value;
}


/** 重新计算金额 */
function FillAmount() {

    const amount = singleAmount;
    if (amount == 0) {
        form.amount = "";
    } else {
        form.amount = amount;
    }

}

let lastCheck = {
    abort: false
}

const onCheckOrder = debounce(async ()=>{

    lastCheck.abort = true; 

    const checkAbort = lastCheck = {
        abort: false
    }

    const { orderid } = form;
    if(!orderid){
        return;
    }

    try{
        
        const result = await checkOrder(orderid);

        if(checkAbort.abort){
            return;
        }

        notOrder = !result;
        if(notOrder){
            return;
        }

        form.clientName = result.custname;

        formEl.validateField("orderid");



    }catch{

        notOrder = true;

    }
    
}, 300);

function onOrderChange(value:string){

    if(!value){
        form.clientName = "";
        notOrder = false;
    }

    onCheckOrder();

}


function onChageType(type: keyof typeof amountTable) {
    FillAmount();
}


function onSizeInput(value: string) {
    FillAmount();
}


function onSelectChange(value: string) {
    newInputValue = value;


    const item = form.autSndList.find((elem) =>  elem.orderid === value)!;

    if(item){
        form.clientName = item.custname
    }


    onOrderChange(value);
    
    
}
function onInputBlur(value: string) {
  
}

function onInput(value: string) {

    elSelectEl.selectedLabel = value;
    elSelectEl.debouncedOnInputChange();
    setTimeout(() => {
        form.orderid = value;
        onOrderChange(value);

    });
}


/** 选择夹展开收缩回调 */
function onVisiblechange(value: boolean) {
    selectHide = value;
    newInputEl.focus();




}

function onSelectBlur() {
    
}






onMounted(() => {



    nextTick(() => {

        const Input = newInputEl.$el.querySelector("input");

        const inpitParent = Input.parentElement;
        const selectInput = elSelectEl.$el.querySelector(".el-input__wrapper input");



        selectInput.parentElement.insertBefore(Input, selectInput);

        inpitParent.parentElement.style = "display:none !important; background-color:red;";
        selectInput.style = "display:none !important;width:0 !important;";


    })

})


defineExpose({

    validate() {
        return formEl.validate();
    },
    async getData() {

        const urlList = [];

        if (Props.upload) {

            try {

                const fileList = await fileEl.getFile();

                for (let index = 0; index < fileList.file.length; index++) {
                    const element = fileList.file[index];

                    const sendForm = new FormData();
                    sendForm.set("img", element, `${element.name}.png`)

                    const string = await uploadImg(sendForm);

                    urlList.push(string);

                }

            } catch {
                messageError("图片上传失败，请重试");
                return;
            }


        }


        return Object.assign(form, {
            img: urlList
        })
    },
    resetFields() {
        formEl.resetFields();
    },
    addAutSnd(items: autSnd[]) {
        form.autSndList.push(...items);
    },
    async getAutSndList() {

        const autSndList = await getAutSndList();

        if (!Props.disabled) {

            autSndList.unshift({
                orderid: "无单号",
                custname: ""
            });

        }


        form.autSndList.push(...autSndList);



    },
    async getSupplier() {

        const dataList = await getSupplier(Props.order);

        if (dataList.length == 1) {
            form.supplier = dataList[0];
        } else {
            form.supplier = dataList.find((elem) => elem.current)!;
        }



        form.supplierList.push(...dataList);



    },

    setValue(orderid: string, type: string) {


        form.orderid = orderid;

        form.type = type;

    },

    async getPltPayCfg() {


        const [err, data] = await to(getPltPayCfg());
        if (!err) {


            amountTable.bmon = data.bmon;
            amountTable.pmon = data.pmon;

        }


    }


})



</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss"></style>
