<template>
  <span class="price-wrap" :style={color}>¥<span class="price" :style="{'font-size': size + 'px' }">{{ value || price || 0}}</span></span>
</template>

<script>
export default {
  name: "price",
   model: {
        prop: 'value'
    },
  components: {},
  props: {
      value:{
          type:Number | String
      },
      price:{
        type:Number
      },
      size:{
        default: 18
      },
      color:{
        type: String,
        default: "rgb(238, 10, 36)"
      }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  mounted() {
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.price-wrap {
  font-weight: 500;
  font-size: 12px;
  margin-right: 10px;
  .price {
    font-weight: 500;
  }
}
</style>
