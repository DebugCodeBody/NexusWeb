<template>
    <van-popup v-model:show="show" position="bottom" round :style="{ height }" @closed="closed">
        <div id="sele-attr" ref="seleAttr">
            <template v-if="!shopping">
                <div class="food-name">
                    <h5>
                        <food-name :name="data.name" :taste="selectProp.prop" />
                    </h5>
                    <span class="price"><span style="font-size: 12px;">¥</span>{{ selectProp.price }}</span>
                </div>
                <div class="number-view">
                    <div class="name">数量</div>
                    <van-stepper 
                            v-model="stepper"
                            :long-press="false" 
                            :disable-input="true" 
                            :min="1"
                            :before-change="beforeChange"
                            @plus="onPlus" 
                            @minus="onMinus" />

                </div>
                <div class="attr-view">
                    <div class="item" v-for="arrItem in test" :key="arrItem.title">
                        <div class="name">{{ arrItem.title }}</div>
                        <div class="value">
                            <span v-for="(item, index) in arrItem.list" :key="index" :class="{
                                select: arrItem.index == index,
                                disable: item.disable
                            }" @click="onSelectProp(arrItem, item, index)">{{ item.name }}</span>
                        </div>
                    </div>
                </div>

            </template>

            <delePopup :data="data" v-model="rest" v-if="shopping" />

            <div class="done-select" :class="{ 'is-empty': isEmpty }">
                <template v-if="!shopping">
                    <div class="left" v-if="!isEmpty">
                        <van-badge :content="shoppNum">
                            <van-button icon="shopping-cart-o" type="primary" round @click="shopping = true" />
                        </van-badge>
                    </div>
                    <div class="right">
                        <van-button type="primary" block round @click="onDone">加入购物车</van-button>
                    </div>
                </template>
                <van-button type="primary" block round @click="show = false;" v-else>确定</van-button>
            </div>
        </div>
    </van-popup>
</template>

<script setup lang="ts">
import delePopup from "./delePopup.vue"
import foodName from "@/components/foodName.vue"

import { useCurrentElement, useFavicon } from "@vueuse/core"
import { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"
import { nextTick, defineEmits, defineProps, watch, computed } from "vue"
import { ref, reactive } from "vue"

import { orderStore } from "@/store/order"
import { timeStore } from "@/store/time"
import { propStore } from "@/store/classProp"
import { selectStore } from "@/store/select"
import { getClass } from "@/api"


const Emits = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
}>();

const Props = defineProps<{
    modelValue: boolean,
    data: foodItem,
}>();

/** 是否存在正常字样 */
let normal = false;
/** 是否为主食 */
let stapleFood = false;
const height = ref("50%");
const seleAttr = ref<HTMLElement>();
const shopping = ref(false);
const rest = ref(true);
const showProp = ref(true);
const selectProp = computed(() => {
    if (normal && test.value.every((elem) => elem.index == 0)) {
        return itemProp.value[0];
    }


    let selectArr:string[] = [];

    
    if (stapleFood) {
        // 如果是主食的话，那就直接取内容。
        // 因为主食的第零个选项是不同值的
        const foodItem = test.value[0]; 
        selectArr.push(foodItem.list[foodItem.index].name)
    } else {
        selectArr.push(...test.value.filter((elem) => elem.index > 0).map((elem) => elem.list[elem.index].name));
        if (selectArr.length == 0) {
            return itemProp.value[0]
        }
    }

    
    return itemProp.value.find((item) => {
            const splitProp = item.prop.split("/");
            return splitProp.length == selectArr.length && selectArr.every((elem) => splitProp.indexOf(elem) > -1);
    })!


});
const itemProp = computed(() => {
    return Props.data.prop
})


const test = ref<{
    index: number,
    list: {
        name: string,
        disable?: boolean
    }[],
    title: string,
}[]>([]);



const time = timeStore();
const order = orderStore();
const StoreProps = propStore();

const show = ref(false);
const stepper = ref(1);
const shoppNum = computed(() => {
    return order.getDayNum(time.activeDateStr, Props.data);
})
const isEmpty = shoppNum.value == 0

/** 是否已经弹窗提醒过增加数量 */
let addPrompt = false;


function closed() {
    Emits('update:modelValue', false);
}

function onSelectProp(arrItem: any, item: any, index: number) {
    if (!item.disable) {
        arrItem.index = index;
    }
}

async function onDone() {
    try {
        if (Props.data.num >= 1 && !addPrompt) {
            await order.addActionPrompt();
        }

        setProp(Props.data);
        order.addFood(time.activeDateStr, time.activeDateTime, Props.data, selectProp.value, stepper.value, true);
        show.value = false;
    } catch (error: any) {
        error.message;
    }

}

function setProp(data: foodItem) {
    data.id = selectProp.value.fid;
}


async function onPlus() {
    try {
        if (Props.data.num >= 1) {
            await order.addActionPrompt();
            addPrompt = true;
        }

        stepper.value += 1;


    } catch (error:any) {
        error.message
        
    }
}

function onMinus() {
    stepper.value -= 1;
}


/** 这里全部返回false, 增减数量通过 onPlus 和 onMinus 函数进行*/
function beforeChange(){
    return false;
}



watch(shoppNum, (value) => {
    if (value == 0) {
        show.value = false;
    }
})


async function init() {
    const { data } = Props;
    const propSet = new Set<string>();
    const propArr: any = {};


    let selectFindProp = itemProp.value.find((elem) => {
        return elem.fid == data.id
    });

    if (!selectFindProp) {
        selectFindProp = itemProp.value[0];
    }

    const attList = await StoreProps.getProp(data.name);
    if (data.type == "主食") {
        stapleFood = true;

        attList[0].list.length = 0;
        attList[0].list.push(...itemProp.value.map((elem)=>elem.prop).reverse());

    } else {

        if (attList.length == 0) {
            showProp.value = false;
            return;
        }

        data.prop.forEach((elem) => {
            if (elem.prop == "正常" || !elem.prop) {
                normal = true;
                return;
            }

            const propSplit = elem.prop.split("/");

            propSplit.forEach((val) => {
                propArr[val] = (propArr[val] || 0) + 1
                propSet.add(val);
            })

        })

        showProp.value = propSet.size > 0

    }


    if (!selectFindProp.prop) {
        selectFindProp.prop = "正常";
        attList.pop();
    }


    const spltProp = selectFindProp.prop.split("/");
    attList.forEach((item) => {
        let index = 0;

        spltProp.find((elem) => {
            index = item.list.findIndex((val) => elem === val);
            return index > -1;
        })
        if (index == -1) {
            index = 0
        }


        test.value.push({
            title: item.title,
            index,
            list: item.list.map((elem) => {
                return {
                    disable: false,
                    name: elem
                }
            })
        })


    })

    if (!normal && !stapleFood) {

        let multiSelect = false;
        const testArr = Object.keys(propArr);

        if (propArr[testArr[0]] > 1) {
            multiSelect = true;
        }

        test.value.forEach((elem, index) => {
            elem.list.forEach((prop) => {
                if (index > 0 && multiSelect) {
                    return
                }

                const { name } = prop;
                prop.disable = !testArr.find(str => {
                    return name == str
                });
            })
        });


    }

}


onMounted(async () => {

    await init();
    show.value = true;

    nextTick(() => {
        const el = seleAttr.value!
        if (el.scrollHeight > el.offsetHeight) {
            height.value = `${el.scrollHeight + 10}px`
        }
    })

})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
#sele-attr {
    height: 100%;
    padding: 10px;
    padding-top: 20px;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;

    .number-view .name,
    .attr-view .name {
        font-size: 12px;
        font-weight: bold;
    }

    .price {
        font-weight: 400;
        font-size: 14px;
        margin-right: 10px;
        color: rgb(238, 10, 36);
        margin-top: 5px;
    }
}

#sele-attr .number-view {
    display: flex;

    align-items: center;
    justify-content: space-between;
    margin-top: 20px;

}

#sele-attr .attr-view {
    flex: 1;
    margin-top: 20px;

    .item {
        margin-bottom: 20px;

        .value {
            margin-top: 15px;

            span {
                display: inline-block;
                padding: 5px 20px;
                border-radius: 5px;
                border: 1px solid red;
                margin-right: 10px;
                margin-bottom: 10px;

                background: #fff;
                border: 1px solid #dcdfe6;
                color: #606266;

                &.select {
                    color: #409eff;
                    background: #ecf5ff;
                    border-color: #b3d8ff;
                }

                &.disable {
                    color: #c0c4cc;
                    background-color: rgb(243, 243, 247);
                }
            }
        }


    }
}

#sele-attr .done-select {
    margin-top: 20px;
    display: flex;

    .left,
    .right {
        width: 50%;
    }

    .left {

        display: flex;
        align-items: center;
        padding-right: 10px;

        .van-badge__wrapper {
            width: 100%;

            button {
                width: 100%;
            }
        }

    }


    .right {
        flex: 1;
        padding-left: 10px;

    }


    &.is-empty {
        .right {
            padding-left: 0px;
        }
    }




}
</style>
