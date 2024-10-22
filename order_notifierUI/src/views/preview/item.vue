<template>
    <div class="item">
        <div class="priority" v-if="data.tight"></div>
        <div class="img-view" @click.stop="onClickImgView" ref="imgView">
            <div v-if="!ImgHref">
            </div>
            <el-image 
                :src="ImgHref" 
                :loading="'lazy'" 
                :lazy="true" 
                :preview-src-list="imgArr"
                :initial-index="0"
                v-else/>
        </div>
        <div style="flex:1;position: relative;">
            <p class="info">
                <order-span :text="data.info" />
                <strong class="priority" v-if="data.tight">加急</strong>
            </p>
            <p class="info" v-if="false">
                <span>{{ data.updatetime }}</span>
                <span>{{ data.lscmemo }}</span>
            </p>
            <p class="other">
                <span class="name">
                    {{ data.fname }}
                </span>
                <span class="group" :style="style">{{ selectGroup.name }}</span>
                <span class="time">{{ parseTime(data.createdate) }}</span>
                <dead-time v-if="data.endtime" :time="data.endtime" />
                <strong v-if="data.is_eva" style="color:red" >工程评判</strong>
                <strong v-if="data.ckdept" style="color:black; margin-left:5px" >品质: {{ data.ckdept }}</strong>
            </p>
            <el-button type="primary" :icon="Edit" size="small" class="edit-button" @click.stop="onClickEdit" v-if="id!=3" />
        </div>
    </div>
</template>


<script setup lang="ts">
import moment from "moment"
import { Edit } from '@element-plus/icons-vue'

import "viewerjs/dist/viewer.css";
import viewerjs from "viewerjs";


import deadTime from "global@/deadTime/index.vue"
import OrderSpan from "global@/OrderSpan/index.vue"




const Emit = defineEmits<{
    (e: "edit"): void
}>();

const Props = defineProps<{
    id: number,
    data: workItem
}>();


const group = inject<any>("group")!;
const imgView = $ref<HTMLElement>();
const ImgHref = $computed(() => {

    const { imgfile } = Props.data;
    if(imgfile.length == 0){
        return "";
    }


    let href = imgfile[0];

    if (process.env.NODE_ENV == "production") {
        href = `../media/smb/${href}`
    } else {
        href = `api/media/smb/${href}`
    }

    return href || "";

})

const imgArr = $computed(() => {


    return Props.data.imgfile.map((elem:string)=>{

        if (process.env.NODE_ENV == "production") {
            elem = `../media/smb/${elem}`
        } else {
            elem = `api/media/smb/${elem}`
        }

        return elem;

    })



})



const selectGroup = group[Props.data.group];
const style = {
    backgroundColor: selectGroup.color || "",
    color: selectGroup.color ? "white" : undefined
}


function parseTime(val: string) {
    return moment(val).format('MM-DD HH:mm')
}

let bigView: any;
function onClickImgView() {



    return;

    // bigView = new viewerjs(imgView, {
    //     inline: false,
    //     toolbar: false,
    //     title: false,
    //     navbar: false,
    //     button: false,
    //     transition: false,
    //     zIndexInline: 9999,
    //     hide() {
    //         setTimeout(() => {
    //             bigView.destroy();
    //             bigView = undefined;
    //         });
    //     }
    // })

    // bigView.view(0);


}

function onClickEdit(){
    Emit("edit");
}


</script>

<script lang="ts">
export default {
    name: ""
}
</script>

<style lang="scss" scoped>
.item {
    position: relative;
    padding: 10px;
    border-radius: 5px;
    background-color: white;
    margin-bottom: 10px;
    cursor: pointer;
    display: flex;


    .img-view {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        background-size: contain;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        background-size: cover;

        .el-image{
            width: 100%;
            height: 100%;
        }
        img {
            width: 0;
            height: 0;
        }
    }


    .group {
        padding: 0 5px;
        border-radius: 5px;
    }

    .info {
        font-size: 14px;
        margin-bottom: 10px;
    }

    .other {
        font-size: 12px;
        color: #595959;

        span {
            margin-right: 10px;
        }
    }


    &:hover {
        .priority {
            width: 6px;
        }

    }

    div.priority {
        height: 100%;
        width: 3px;
        background-color: red;
        position: absolute;
        top: 0;
        left: 0;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        transition: width 218ms ease-in;
    }

    strong.priority{
        background-color: red;
        border-radius: 5px;
        margin-left: 10px;
        color: white;
        padding:0 5px;



    }



    .edit-button {
        position: absolute;
        right: 0;
        top: 0;
    }






}
</style>
