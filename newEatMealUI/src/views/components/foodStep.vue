<template>
    <van-stepper v-model="value" :before-change="beforeChange" :min="min" :disable-input="true" :long-press="false" />
</template>

<script setup lang="ts">
import { Dialog } from 'vant';
import { addNumReminder } from "@/utils/other"


interface Emits {
    (e: 'numChange', value: number): void;
}


const Emit = defineEmits<Emits>();
const Props = defineProps<{
    modelValue: number,
    data: reFood,
    min: number
}>();


const value = $computed({
    get() {
        return Props.modelValue;
    },
    set(value) {
    }

})


function triggerChangeCall(value: number) {
    Emit('numChange', value);
}

function beforeChange(newValue: number) {

    const changeValue = newValue - value;
    return new Promise<boolean>((resolve, reject) => {
        resolve(false);

        if (changeValue > 0) {

            if (Props.data.cartNum > 0) {

                addNumReminder().then(() => {
                    triggerChangeCall(changeValue);
                })

            } else {
                triggerChangeCall(changeValue);
            }

        } else {
            triggerChangeCall(changeValue);
        }

    })

}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">

</style>
