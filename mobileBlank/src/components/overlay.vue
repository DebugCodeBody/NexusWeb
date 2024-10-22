<template>
	<div class="overlay" 
	v-show="show"
	:style="{top, left, width, height}" 
	:class="{active :show }"
	@click.stop="click($event)" 
	@touchmove.stop="event"></div>
</template>

<script setup lang="ts">
import {useCurrentElement} from "@vueuse/core"
import {ref, nextTick, defineEmits, defineProps,watch,onBeforeMount, onMounted, onBeforeUnmount, onUnmounted} from "vue"

const props = defineProps({
	show: Boolean
})


const el = useCurrentElement()
const top = ref(String.Empty)
const left = ref(String.Empty)
const width = ref(String.Empty)
const height = ref(String.Empty)

const emit = defineEmits(["click"])

nextTick(() => {
	const parent: HTMLElement = el.value.parentElement as HTMLElement

	const {offsetTop, offsetLeft, offsetHeight, offsetWidth} = parent

	top.value = `${offsetTop}px`
	left.value = `${offsetLeft}px`

	height.value = `${offsetHeight}px`
	width.value = `${offsetWidth}px`

})

function click(event: MouseEvent) {
	emit("click", event)
}
function event() {}
</script>

<script lang="ts">
export default {
	name: "overlay"
}
</script>

<style lang="scss">

.overlay {
	position: fixed;
	background-color: rgba(0, 0, 0, 0.7);
	z-index: 9999;
	opacity: 0;
	

	transition: opacity 0.3s;

	&.active{
		opacity: 1;
	}
	
}
</style>
