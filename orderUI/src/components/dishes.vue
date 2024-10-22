<template>
    <span v-if="!this.highlighted ">{{ name }}</span>
    <span v-else>{{ getName }}(<span  style="color:red;padding:0 2px;">{{ this.highlighted }}</span>)</span>
</template>


<script>
export default {
  name: "",
  components: {},
  props: {
    name:String,
  },
  beforeCreate() {
    
  },
  created() {
    this.replace = ["(辣)","(无调料)"].find((name)=>{
      return this.name.indexOf(name) > -1;
    })
  
  
    this.highlighted = this.replace && this.replace.replace(/[\(\)]/g,"");


  },
  beforeMount() {},
  data() {
    return {
      
    };
  },
  watch: {},
  computed: {
    isSpicy(){
        return this.name.includes(this.replace)
    },
    getName(){
        return this.name.replace(this.replace,"");
    }
  },
  methods: {},
  mounted() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss" scoped>
</style>
