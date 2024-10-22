<template>
	<div class="messagePopup" ref="messageDiv">
		<div class="check" ref="check" :style="{'background-color': iconColor }">{{ icon }}</div>
		<p>{{ title }}</p>
		<p>{{ message }}</p>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
import {ref, nextTick,defineProps} from "vue"


defineProps({
	icon: String,
	title: String,
	message: String,
	iconColor: String
})


const check = ref()
const messageDiv = ref()
nextTick(() => {
	setTimeout(() => {
		messageDiv.value.classList.add("comein")
		check.value.classList.add("scaledown")
	}, 300)
})

</script>

<style lang="scss">
.messagePopup {
	position: absolute;
	top: -200px;
	width: 290px;
	height: 300px;
	background: white;
	border-radius: 8px;
	padding: 30px;
	text-align: center;
	font-weight: 300;
	color: #2c2928;
	opacity: 0;
	transition: top 0.3s cubic-bezier(0.31, 0.25, 0.5, 1.5), opacity 0.2s ease-in-out;
	box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
	left: 50%;
	transform: translateX( -50%);


	&.comein {
		top: 150px;
		opacity: 1;
	}
	p {
		font-size: 20px;
		margin: 25px 0px;
		padding: 0;
	}
	p:nth-child(2) {
		font-size: 46px;
		margin: 40px 0px 0px 0px;
	}

	.check {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%, -50%) scale(4);
		width: 120px;
		height: 120px;
		color: white;
		font-size: 76px;
		border-radius: 50%;
		opacity: 0;
		transition: transform 0.2s 0.25s, opacity 0.1s 0.25s ease-in-out;
		
	display: flex;
	justify-content: center;
	align-items: center;

		&.scaledown {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}
}
</style>
