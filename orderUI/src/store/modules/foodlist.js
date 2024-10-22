import vue from "vue";



const state = {
    data:{

    },
    showDate: "",
    foodshow: false,
    submitlock: false


};

const mutations = {
    // 切换显示日期
    SWITCH_DATE(state,date){
        state.showDate = date;
    },
    // 给指定日期添加数据
    ADD_LIST(state, {date,data,end}){
        data.end = end;
        data.lock = false;
        vue.set(state.data,date,data);
    },
    // commit 不返回数据，所以这个鸟用都没用。那为啥还要留在这里呢
    // 就是为了提醒自己别再犯错了
    GET_LIST(state,date){
        return state.data[date];
    },
    // 
    SWITCH_FOODSHOW(state, statu){
        state.foodshow = statu;
    },
    // 切换提交锁，用来提交的时候屏蔽用户的操作
    SWITCH_SUBMITLOCK(state, statu){
        state.submitlock = statu;
    },
    // 锁住某一天不给操作
    LOCK_DATE(state, { date,statu }){
        state.data[date].lock = statu;
    }
}


  

export default {
    namespaced: true,
    state,
    mutations

}