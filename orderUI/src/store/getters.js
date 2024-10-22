const getters = {
  userName(state){
    return state.user.name;
  },
  userEmpid(state){
    return state.user.empid
  },
  userId(state){
    return state.user.userId
  },
  avatar(state){
    return state.user.avatar
  },
  monthcost(state){
    return state.user.cost
  },
  totleMoney(state){
    return state.cart.to.totleMoney || state.order.to.totleMoney
  }
}
export default getters
  