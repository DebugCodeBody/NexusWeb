<template>
    <div v-show="show" class="overlay" v-on="$listeners" :style="{'z-index':index}">
        
    </div>
</template>

<script>
let zIndex = 100;
export default {
  name: "overlay",
  components: {},
  props: {
      show:{
          type: Boolean,
          required: true
      }
  },
  beforeCreate() {
    
  },
  created() {
    this.provide = !!this.$attrs["z-index"];

    const index = parseInt(this.$attrs["z-index"]);
    if(Number.isNaN(index)){
        this.index = ++zIndex;
    }else{
        this.provide  = true;
         this.index = index
    }

  },
  beforeMount() {},
  data() {
    return {
      index: 0,
      provide: false

    };
  },
  watch: {
      show(value){
          if(value && !this.provide){
              this.index = ++zIndex;
          }

      }
  },
  computed: {},
  methods: {},
  mounted() {
  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.overlay{
  
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999999;
}
</style>
