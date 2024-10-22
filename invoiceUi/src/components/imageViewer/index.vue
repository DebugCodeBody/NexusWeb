<template>
    <div class="image-viewer">
        <el-image-viewer 
            ref="imageViewerEl" 
            :urlList="urlList" 
            :onClose="onImageClose"
            :onSwitch="onImageSwitch"
            :initial-index="initialIndex"

            v-if="showViewer" />

        <el-image :src="src" :fit="fit" @load="onImgLoad" @error="onImgErr" @click="onClickImage" v-if="showImg && src" ></el-image>


    </div>
</template>

<script setup lang="ts">

import { useCurrentElement } from "@vueuse/core"

// @ts-ignore

const Emit = defineEmits<{
    (e: 'update:initialIndex', value: number): void;
    (e: 'update:showPreview', value: boolean): void;
    (e: 'load', value: Event): void
    (e: 'error', value: Event): void
}>();

const Props = withDefaults(defineProps<{
    
    src: string|string[],
    
    initialIndex?: number,

    showPreview?:boolean,

    showImg?:boolean
}>(), {
    initialIndex: 0,
    showPreview:false,
    showImg:true
});


watch(() => Props.showPreview, (value) => {
    if (value) {
        onClickImage();
    }

})

let showViewer = $ref(false);

let fit = "fill"




let parentNode:HTMLElement | null;
const el = $ref<HTMLElement>(useCurrentElement());

const imageViewerEl = $ref<any>();

const urlList = computed(()=>{
    const { src } = Props

    return Array.isArray(src) ? src : [src];

})

function getImageNaturalSizes(elem: HTMLElement, naturalWidth: number, naturalHeight: number) {
    const viewerWidth = elem.clientWidth;
    const viewerHeight = elem.clientHeight - 120;

    // let initialCoverage = Math.max(0, Math.min(1, 0.9));

    const aspectRatio = naturalWidth / naturalHeight;
    let initialCoverage = 0.9;
    let width = viewerWidth;
    let height = viewerHeight;


    if (viewerHeight * aspectRatio > viewerWidth) {
        height = viewerWidth / aspectRatio;
    } else {
        width = viewerHeight * aspectRatio;
    }

    width = Math.min(width * initialCoverage, naturalWidth);
    height = Math.min(height * initialCoverage, naturalHeight);

    const left = (viewerWidth - width) / 2;
    const top = (viewerHeight - height) / 2;

    const imageData = {
        left,
        top,
        x: left,
        y: top,
        width,
        height,
        oldRatio: 1,
        ratio: width / naturalWidth,
        aspectRatio,
        naturalWidth,
        naturalHeight,
    };

    return imageData
}

function onImageClose() {

    showViewer = false;

    // imageViewerEl.$el.style.display = "none";

    
    Emit('update:showPreview', false);


}

function onClickImage() {
    showViewer = true;

    nextTick(() => {


        const viewer__wrapper = document.querySelector(".el-image-viewer__wrapper")!;



        const imgEl = viewer__wrapper.querySelector("img")!;

        const imgHeight = imgEl.naturalHeight;
        const imgWidth = imgEl.naturalWidth;

        const sizeRect = getImageNaturalSizes(document.body, imgWidth, imgHeight);


        const mask = viewer__wrapper.querySelector(".el-image-viewer__mask")!;
       

        mask.addEventListener("click", (event)=>{

            onImageClose();

        });

    })

}




function onImageSwitch(value: number) {
    Emit('update:initialIndex', value);
}

function onImgLoad(event: Event) {

    
    const imgEl = event.target as HTMLImageElement;

    const { clientWidth, clientHeight } = el;
    const { naturalWidth, naturalHeight } = imgEl;


    let setHeight = "";
    if(clientWidth >= naturalWidth && clientHeight >= naturalHeight){
        
    } else {
        setHeight = `${clientHeight}px`
    }

    /** 如果宽度和高度都是0，那么就是隐藏了就不进行设置 */
    if(clientWidth > 0 || clientHeight > 0){
        imgEl.style.height = setHeight;
    }



    Emit("load", event);

}

function onImgErr() {

    // console.log("图片加载失败")

}


</script>

<script lang="ts">
export default {
    name: "image-viewer"
}
</script>

<style lang="scss">
.image-viewer {

    // // 这里不可以设置成百分百，一些小图片的话也会拉伸导致占满整个组件
    // .el-image{
    //     width: 100%;
    //     height: 100%;
    // }

    .el-image img {
        cursor: pointer;
    }


}

.el-image-viewer__wrapper.screen-viewer {
    position: absolute !important;

    &:focus-visible {
        border: 0;
        outline: 0;
    }
}
</style>
