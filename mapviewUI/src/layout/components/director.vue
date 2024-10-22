<template>
	<div class="director" @touchstart="touchstar" @touchend="touchend" >
		<Avatar class="avatar" :src="avatar"/>
		<div class="info">
			<div class="name"><span>{{ name || "****" }}</span></div>
            <div class="branch">{{ branch  }} </div>
		</div>
	</div>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar.vue"
import {ref, nextTick, defineProps, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue"

import { getUserName,getUserAvatar,getUserBranch} from "@/utils/auto";


const name = getUserName();
const branch = getUserBranch();
const avatar = ref(getUserAvatar());

if(process.env.NODE_ENV != "production"){
	avatar.value = require("@/assets/avatar.webp");
}

const time = ref(0);
const nowTime = ref(Date.now());


function touchstar(event:Event) {
	event.stopPropagation();
	event.preventDefault();

	
	// nowTime.value = Date.now();
	// time.value = setTimeout(() => {
	// 	localStorage.clear();

	// 	Dialog.confirm({
	// 		message: "缓存清空啦,是否刷新页面？"
	// 	}).then(() => {
	// 		location.reload();
	// 	})

	// }, 5000)

}
function touchend() {
	clearTimeout(time.value);

	// if (Date.now() - nowTime.value < 260) {
	// 	return;
	// }
}



</script>

<style lang="scss">
.director {
	height: 60px;
	background-color:white;


	display: flex;
	align-items: center;

	border-radius: 5px;
	padding: 5px 0;

	.avatar {
		margin-left: 10px;
		margin-right: 20px;
	}
	.info {
		height: 100%;
        display: flex;
        flex-direction: column;

        justify-content: space-around;
		.name {

			font-weight: 700;
		}

        .branch{
            font-size: 12px;
        }
	}
}
</style>
