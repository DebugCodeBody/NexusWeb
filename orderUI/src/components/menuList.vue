<template>
  <div class="menu">
    <div class="menu-list-wrap">
      <ul class="card-wrap" ref="card-wrap" v-show="data.length > 0 ">
      
        <template v-for="{ name, items } in data" >
          <li class="title" :key="name" :ref="name">{{ name }}</li>

          <menuCard v-for="shopp in items" :shopp="shopp" :key="shopp.id + data.date"  :disabled="disabled"  :edit="edit"/>
        </template>
      </ul>
      <div v-if="data.length == 0" class="no">
        <van-icon name="warn-o"/>
        <span >今天暂不供餐！</span>
      </div>
    </div>
  </div>
</template>

<script>
import menuCard from "@/components/menuCard";
import { mapState } from "vuex";


export default {
  name: "menuList",
  components: {
    menuCard
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    disabled: Boolean,
    edit: Boolean
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  data() {
    return {};
  },
  watch: {
  },
  computed: {},
  methods: {
  },
  mounted() {
   
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.menu {
  flex: 1;
  background: white;
  .menu-list-wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .card-wrap {
    position: absolute;
    padding: 10px 0;
    box-sizing: border-box;
    overflow: auto;
    height: 100%;
    width: 100%;
    overflow: auto;
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    padding: 5px;
    padding-top: 10px;
  }
  .no {
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 80px;
    display: flex;
    flex-direction:column;

    justify-content: center;

    i{
      color:#f56c6c;
    }
    
    span{
      font-size: 18px;
    }
  }
}
</style>
