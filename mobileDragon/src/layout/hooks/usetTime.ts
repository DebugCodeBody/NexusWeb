
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';




let lastTime = -1 // 定时器指针
const mixTime = 5; // 最小定时时间，单位分钟
const dialogVisible = ref(false) // 设置定时的弹窗
const timing = ref(mixTime) // 输入框变量


/**
 * 设置定时时间
 */
function startTime(callback: any) {
    const { value: time } = timing

    clearTime();

    dialogVisible.value = false;
    if (time <= 0) {
        return
    } else if (time >= mixTime) {
        lastTime = window.setInterval(callback, time * 1000 * 60);
    }

}

function clearTime() {
    clearInterval(lastTime)
}


export {
    timing,
    dialogVisible,

    startTime,
    clearTime
}