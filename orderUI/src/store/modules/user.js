import vue from "vue";
import { Dialog } from 'vant';

import { getUserInfo, setUserInfo, removeUserInfo } from "@/utils/auth";

const state = {
  ...getUserInfo(),
  cost:0
};


const mutations = {
  SET_INFO(state, info) {
    
    for(const [key,value] of Object.entries(info)){
      vue.set(state,key,value);
    }

  },
  SET_NAME(state, name) {
    state.name = name;
  },
  SET_EMPID(state, id) {
    state.empid = id;
  },
  ADD_COST(state,cost){
    state.cost = cost;

  }
};

const actions = {
  CONFIRM_EDIT() {
    
    return new Promise(async (resolve, reject) => {
      try {
        await Dialog.confirm({
          message: "是否编辑已点清单？"
        });
        
        
        this.commit("cart/CLONE_TO", this.state.order.to);

        this.commit("order/EMPTY_THEDAY");
        this.commit("order/CLOSE_SHOW");

        resolve();
      } catch (error) {
        reject()
      }
      
    });
  }
};

export default {
  namespaced: true,

  state,
  mutations,
  actions
};
