<template>
    <overlay :show="overlayShow" @click="isShow = false">
        <transition name="time-dialog-fade" class="time-dialog" @after-leave="onAfterLeave">
            <div v-show="isShow">
                <div class="time-dialog__body">
                    <span>设置定时：</span>
                    <div class="input-content" :class="{ 'is-error': error }">
                        <input type="number" v-model="val" @input="change" @keydown.enter="determine" ref="timeInput" />
                        <span class="error">必须大于等于1分钟</span>
                    </div>
                    <span>分</span>
                </div>
                <div class="time-dialog__footer">
                    <button @click="isShow = false">取消</button>
                    <button @click="determine">确定</button>
                </div>
            </div>
        </transition>
    </overlay>

</template>

<script setup lang="ts">
import overlay from "@/components/overlay.vue"

import { useCurrentElement } from "@vueuse/core"
import { ref, reactive, nextTick, defineEmits, defineProps, watch, computed, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from "vue"

const Emits = defineEmits<{
    (e: 'callBack'): void;
    (e: 'update:delay', value: number): void;
    (e: 'update:visible', value: boolean): void;
}>();

const Props = defineProps<{
    visible?: boolean
    /**
     * 定时刷新时间，单位分钟
     */
    delay: number,
}>();

const timeInput = ref();
const overlayShow = ref(false)


let time = -1;
const el = useCurrentElement();
const val = ref()
const show = ref(false)
const error = ref(false);
const isShow = computed({
    get() {
        return Props.visible || show.value;
    },
    set(value) {
        show.value = value;
        Emits("update:visible", value);
    }
})

watch(isShow, (value) => {
    if (value) {
        if (val.value == undefined) {
            val.value = Props.delay
        }

        overlayShow.value = true;
        nextTick(() => {
            timeInput.value.focus()
        })
        stop();
    } else {
        start();
    }
}, {
    immediate: true
})

function validation() {
    return val.value > 0
}

function start() {
    time = window.setTimeout(() => {
        Emits("callBack");
    }, Props.delay * 1000 * 60);
}

function stop() {
    if (time != -1) {
        window.clearTimeout(time);
        time = -1;
    }
}

function change() {
    error.value = !validation();
}

function determine() {
    if (validation()) {
        isShow.value = false;
    }
}

function loadTime() {
    show.value = true;
}

onMounted(() => {
    document.body.appendChild(el.value);
})

function onAfterLeave(){
    overlayShow.value = false;
}


defineExpose({
    start,
    stop,
    loadTime
})

</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.time-dialog-fade-enter-active {
    animation: time-dialog-fade-in .3s;
}

.time-dialog-fade-leave-active {
    animation: time-dialog-fade-out .3s;
}

@keyframes time-dialog-fade-in {
    0% {
        transform: translate3d(-50%, -20px, 0);
        opacity: 0;
    }

    100% {
        transform: translate3d(-50%, 0, 0);
        opacity: 1;
    }
}

@keyframes time-dialog-fade-out {
    0% {
        transform: translate3d(-50%, 0, 0);
        opacity: 1;
    }

    100% {
        transform: translate3d(-50%, -20px, 0);
        opacity: 0;
    }
}


.time-dialog {
    width: 80%;
    max-width: 500px;
    font-size: 16px;

    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    padding: 10px;

    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);


    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }

    input {
        -moz-appearance: textfield;
    }

    .time-dialog__body,
    .time-dialog__footer {
        padding: 20px;
    }

    .time-dialog__body {
        display: flex;
        align-items: center;

        .input-content {

            flex: 1;
            width: 50px;

            margin-right: 10px;
            display: flex;
            position: relative;


            input {
                width: 100%;
                padding: 10px;
                border: 1px solid rgb(220, 223, 230);
                border-radius: 5px;
                z-index: 1;

                &:focus-visible {
                    border: 1px solid #409eff;
                    outline: none;
                }

            }



            .error {
                font-size: 12px;
                position: absolute;
                color: #f56c6c;
                bottom: 0;
                opacity: 0;

                transition: all 0.3s;
            }

            &.is-error {
                .error {
                    opacity: 1;
                    transform: translateY(100%);
                }
            }
        }




    }

    .time-dialog__footer {
        text-align: right;
        padding-right: 0;

        button {
            cursor: pointer;
            padding: 8px 15px;
            background-color: white;

            border: 1px solid #dcdfe6;
            border-radius: 5px;

            &:hover {
                color: #409eff;
                background-color: #ecf5ff;
                border-color: #c6e2ff;
                outline: 0;
            }

            &:first-child {
                margin-right: 10px;
            }

            &:last-child {
                color: white;
                background-color: #409eff;
                border-color: #409eff;

                &:hover {
                    color: #ffffff;
                    background-color: #79bbff;
                    border-color: #79bbff;

                }
            }

        }

    }
}
</style>
