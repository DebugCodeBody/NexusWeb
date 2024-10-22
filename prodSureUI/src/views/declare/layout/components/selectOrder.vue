<template>

    <el-select v-model="select" filterable remote reserve-keyword :remote-method="remoteMethod" :loading="loading"
        loading-text="搜索订单中" >
        <el-option v-for="item in options" :key="item.orderid" :label="item.orderid" :value="item.orderid" />
    </el-select>
</template>

<script setup lang="ts">
import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

import { suggest } from "@/api"
import { debounce } from "@/utils/other"

interface Emits {
    (e: 'update:modelValue', value: string): void;
    (e: 'onOrderSelect', value: remoteSearch): void;
}

const el = useCurrentElement();
const emit = defineEmits<Emits>();
const Props = defineProps<{
    modelValue: string
}>();


const select = ref();
const options = ref<remoteSearchs>([]);
const loading = ref(false);
/**
 * 是否远程搜索选中的结果
 */
let remoteChange = false;

const remoteMethod = debounce(async function (val: string) {
    if (!val) {
        options.value = [];
        return;
    }

    select.value = val;
    options.value = [{
        orderid: val,
        moid: 0,
        attaid: 0,
    }]


    loading.value = true;
    suggest(val).then((data: remoteSearchs) => {
        if (data.length == 0) {
            return;
        }
        options.value = data;
    }).finally(() => {
        loading.value = false;
    })

}, 500)

watch(select, (value) => {
    remoteChange = true;
    emit('update:modelValue', value);
})

watch(() => {
    return Props.modelValue
}, (value) => {
    if (remoteChange) {
        remoteChange = false;
        return
    }

    options.value = [{
        orderid: value,
        moid: 0,
        attaid: 0,
    }]

    select.value = value;

})


// node_modules\element-plus\es\components\select\src\select.mjs
// 通过修改源码，把它的 readonly 值设置为false
// 且把变量绑定给删除掉，这样在失去焦点的时候就不会设置这个鬼属性了



</script>

<script lang="ts">
export default {
    name: "selectOrder"
}
</script>

<style lang="scss">
</style>
