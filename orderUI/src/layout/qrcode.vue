<template>
  <div class="qrCode-wrap">
      <div id="qrCode" ref="qrCode"></div>
  </div>
</template>

<script>
import { getfcardid } from "@/utils/auth"

export default {
  name: "qrcode",
  components: {},
  props: {},
  beforeCreate() {},
  created() {
  },
  beforeMount() {},
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  mounted() {

    var qrcode = new QRCode(this.$refs.qrCode, {
      width: 220,
      height: 220
    });

    qrcode.makeCode(getfcardid());

  },
  beforeDestroy() {},
  destroyed() {}
};
</script>

<style lang="scss">
.qrCode-wrap{
    width: inherit;
    height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    

}
#qrCode {
  width: 220px;
  height: 220px;
}
</style>
