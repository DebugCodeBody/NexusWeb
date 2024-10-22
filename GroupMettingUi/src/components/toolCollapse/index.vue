<template>
    <div class="tool-collapse" :class="{
        'is-active': isActive
    }">

        <div class="header" @click="onHandleHeaderClick">
            <span class="icon">
                <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M15 6.675l-1.8-.6c-.2-.1-.3-.3-.2-.4l.9-1.7c.6-1.2-.7-2.5-1.9-1.9l-1.7.9c-.1.1-.3 0-.4-.2l-.6-1.8c-.4-1.3-2.2-1.3-2.6 0l-.6 1.8c-.1.2-.3.3-.4.2l-1.7-.9c-1.2-.6-2.5.7-1.9 1.9l.9 1.7c.1.1 0 .3-.2.4l-1.8.6c-1.3.4-1.3 2.3 0 2.7l1.8.6c.2 0 .3.2.2.3l-.9 1.7c-.6 1.2.7 2.5 1.9 1.9l1.7-.9c.2-.1.4 0 .4.2l.6 1.8c.4 1.3 2.3 1.3 2.7 0l.6-1.8c.1-.2.3-.3.4-.2l1.7.9c1.2.6 2.5-.7 1.9-1.9l-1-1.7c-.1-.2 0-.4.2-.4l1.8-.6c1.3-.4 1.3-2.2 0-2.6zm-7 3.7c-1.3 0-2.4-1.1-2.4-2.4 0-1.3 1.1-2.4 2.4-2.4 1.3 0 2.4 1.1 2.4 2.4 0 1.3-1.1 2.4-2.4 2.4z"
                        fill="#4C4F5A"></path>
                </svg>
            </span>
            <span class="name">{{ name }}</span>
            <span class="arrow">
                <svg width="16" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.709 7.651l6.161-5.622c.241-.22.383-.517.383-.84 0-.323-.142-.62-.383-.84A1.361 1.361 0 0 0 13.95 0c-.354 0-.68.13-.921.349l-5.27 4.808L2.492.349A1.361 1.361 0 0 0 1.57 0C1.215 0 .89.13.648.336.38.569.253.879.253 1.189c0 .297.127.595.368.84 1.615 1.486 5.807 5.325 6.09 5.596l.03.026c.509.465 1.458.465 1.968 0z"
                        fill="#4C4F5A"></path>
                </svg>
            </span>
        </div>
        <el-collapse-transition>
            <div class="item__wrap" v-show="isActive">
                <div class="item__content">
                    <slot></slot>
                </div>
            </div>
        </el-collapse-transition>

    </div>
</template>

<script setup lang="ts">

const Emit = defineEmits<{
    (e: "change", value: boolean): void

    /** Vue3 的更新 */
    (e: 'update:modelValue', value: boolean): void;
    /** Vue2 的更新 */
    (e: 'input', value: boolean): void;

}>();

const Props = defineProps<{
    /** vue3 用来控制弹窗是否出现 */
    modelValue?: boolean

    /** vue2 用来控制弹窗是否出现  */
    value?: boolean

    name: string
}>();


let isActive = $ref(Props.modelValue || Props.value);


function onHandleHeaderClick() {

    isActive = !isActive;

    
    Emit("update:modelValue", isActive);
    Emit("input", isActive);
    
    Emit("change", isActive);

    

}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss">
.tool-collapse {

    border-width: 1px;
    border-radius: 5px;

    margin-bottom: 10px;

    &:last-child {
        margin-bottom: 0;
    }

    .item__content {
        color: #303133;
        padding: 10px;
    }

    .header {
        display: flex;
        justify-content: space-between;

        align-items: center;
        border-radius: 5px;

        cursor: pointer;


        .name {
            font-weight: 900;
            margin: 0;
            flex: 1;
        }

        .icon,
        .arrow {
            margin: 10px;
        }


        .icon {
            display: none;
        }


        .name {
            margin-left: 10px;
        }

        .arrow {
            transform: rotate(-90deg);
            transition: transform .5s;
        }

    }

    &.is-active {
        .header {
            .arrow {
                transform: rotate(0deg);
            }
        }
    }

}
</style>
