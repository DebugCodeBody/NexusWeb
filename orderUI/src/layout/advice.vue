<template>
  <div class="advice-wrap">
    <div class="text-wrap">
      <van-field v-model="value" placeholder="请输入建议内容" type="textarea" />
    </div>
    <div style="margin: 16px;" >
      <van-button
        round
        block
        type="info"
        native-type="submit"
        :disabled="!value || lock"
        @click="click"
        >提交</van-button
      >
    </div>
  </div>
</template>

<script>
import {submitadvice} from "@/api";
import {getempid,getUserName} from "@/utils/auth";

export default {
  name: "advice",
  components: {},
  props: {},
  beforeCreate() {},
  created() {
    
    this.name = getUserName();
    this.lock =  !this.name || this.name == "";

  },
  beforeMount() {},
  data() {
    return {
      value: "",
      name: "",
      lock: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    click() {
      if (!this.value) {
        this.$toast.fail("请添加建议内容");
        return;
      }

      this.$dialog.confirm({
        message: "确认是否提交"
      })
        .then(() => {
            submitadvice(this.name,getempid(),this.value).then(()=>{
                this.lock = true;
                this.$toast.success("提交成功");
            }).catch(()=>{
                this.$toast.fail("提交失败，请稍后重试");
            })

        })
        .catch(() => {
          // on cancel
        });
    }
  },
  mounted() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.advice-wrap {
  height: 100%;
  width: 100%;

  * {
    box-sizing: border-box;
  }

  .text-wrap {
    padding: 10px;
  }
  .van-field {
    border-radius: 10px;
    box-shadow: 0 0 11px rgb(33 33 33 / 20%);
  }
  textarea {
    padding: 5px;
    resize: none;
    height: 280px;
    width: 100%;
  }
}
</style>
