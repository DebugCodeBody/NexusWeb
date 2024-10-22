<template>
  <div id="app">
    <h3 class="title">维修申报</h3>



    <el-form ref="form" label-width="80px" :rules="rules" :model="form"
    
    
    v-loading="loading"
    element-loading-text="正在获取数据"
    element-loading-svg-view-box="-10, -10, 50, 50"
    element-loading-background="rgba(122, 122, 122, 0.8)"
    >
      <el-form-item label="申报人员" prop="name">
        <el-input v-model="form.name" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="设备名字" prop="equipment">
        <el-input v-model="form.equipment" :disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="问题类型" prop="problem">
        <el-radio-group v-if="!isSelect()" v-model="form.problem" :disabled="submit" size="mini">
          <el-radio border v-for="(item, index) in question" :key="index" :label="index">{{ item }}</el-radio>
        </el-radio-group>

        <el-select v-else v-model="form.problem" placeholder="请选择">
          <el-option v-for="(item, index) in question" :key="index" :label="item" :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题描述" ref="describe" prop="describe">
        <el-input v-model="form.describe" @input="input" :disabled="submit || midErr" type="textarea" ref="textarea">
        </el-input>
      </el-form-item>

      <el-result icon="error" title="错误" :sub-title="errorText" v-if="midErr">
      </el-result>
    </el-form>

    <el-button 
      class="submit-button"
      type="primary"
      @click="onSubmit"
      v-if="!submit"
      :disabled="midErr || loading"
      style="width: 100%">确定提交</el-button>

    <el-button class="submit-button" type="success" style="width: 100%" v-else>提交成功</el-button>

    <div class="toa-view">
      <div>
        <el-button v-for="item in this.showToUrls" :key="item.id" @click="toApp(item)">{{ item.name }}</el-button>
        <el-button v-if="this.toUrls.order" @click="onClickUrlMore">更多</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeclareName, addProblem, getDescribe, getToUrls, getCorpId, addToUrlCount } from "@/api";
import { Random } from "@/utils";

function splitSearch(url) {
  const str = url.split("?")[1];
  if (!str) {
    return {};
  }
  const arr = str.split("&");
  const obj = {};
  arr.forEach(item => {
    const oneItem = item.split("=");
    obj[oneItem[0]] = oneItem[1];
  });
  return obj;
}


async function getRequestAuthCode(corpId) {

  return new Promise((resolve) => {



    dd.runtime.permission.requestAuthCode({
      corpId,
      onSuccess: function (result) {
        if (result.code) {
          resolve(result.code)
        } else {
          resolve()
        }
      },
      onFail: function (err) {
        resolve()
      }

    })


  })

}

export default {
  name: "App",
  components: {},
  props: {},
  beforeCreate() { },
  created() {


    this.search = splitSearch(location.search);
    if (process.env.NODE_ENV == "development") {
      // this.search.mid = 3;
    }
    const { mid, corpId } = this.search;

    if (!mid) {
      this.$nextTick(() => {
        this.errorText = "请通过扫描二维码进入";
      });
      return;
    }



    new Promise((resolve, reject) => {

      getCorpId().then((data) => {

        let index = 0;


        const self = this;
        function getID(id) {

          getRequestAuthCode(id).then((value) => {

            if (value) {
              self.init(value, id)
              return Promise.resolve();
            } else {
              return Promise.reject();
            }

          }).catch(() => {
            if (index >= data.data.length - 1) {
              reject()
            } else {
              index += 1;

              getID(data.data[index])
            }

          })
        }

        getID(data.data[index])

      }).catch(()=>{
        this.errorText = "环境错误，请稍后重试";
      })

    }).catch(() => {
      this.errorText = "环境初始化失败，请稍后重试！";
    });

  },
  beforeMount() { },

  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请先获取申报人员"));
      } else {
        callback();
      }
    };

    var validateProblem = (rule, value, callback) => {
      value = this.question[value];

      if (!value) {
        callback(new Error("请先选择问题类型"));
      } else {
        callback();
      }
    };

    var validateDescribe = (rule, value, callback) => {

      if (this.question[this.form.problem] == "其他问题" && value == "") {
        callback(new Error("请输入其他问题描述"));
      } else {
        callback();
      }
    };

    return {
      toUrls: [],
      loading: true,
      errorText: "",
      showToUrls: [],
      // 其他问题的数组索引
      other: -1,
      // 是否 mid 错误
      midErr: false,
      // 是否提交成功
      submit: false,
      search: {},
      form: {
        // 申报人员
        name: "",
        // 选中问题类型索引
        problem: "",
        // 问题描述
        describe: "",
        // 设备名字
        equipment: ""
      },
      // 问题类型数组
      question: [],
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        problem: [{ validator: validateProblem, trigger: "blur" }],
        describe: [{ validator: validateDescribe, trigger: "blur" }]
      }
    };
  },
  watch: {
    errorText(value) {
      this.loading = false;
      if(this.midErr){return}
      this.midErr = true;

      this.$alert(value, "错误", {
        confirmButtonText: "确定",
        type: "error",
        center: true
      });
    }
  },
  computed: {},
  methods: {
    init(AuthCode, corp) {


      if (!AuthCode) {
        this.midErr = true;
        this.errorText = "钉钉免登录失败";
        return;
      }

      getDeclareName(AuthCode, corp).then(result => {
        this.form.name = result.data.name;


        getToUrls(result.data.name).then((data) => {

          this.toUrls = data.data;
          if (this.toUrls.order) {
            this.showToUrls.push(this.toUrls.data[0])
          } else {
            this.onClickUrlMore()
          }

        }).catch(() => {
          this.midErr = true;
        })


      }).catch((error) => {
        this.errorText = error.message || error.msg || "获取用户名失败";
      })

      getDescribe(this.search.mid).then(result => {
        const { data } = result;

        this.tid = data.tid;
        this.form.equipment = data.name;

        this.question = data.typename;

        if (this.question.length == 1) {
          this.form.problem = 0;
        }

        this.loading = false;
        this.other = this.question.findIndex(elem => elem == "其他问题");
        if (this.other == -1) {
          this.other = this.question.push("其他问题") - 1;
        }
      }).catch(error => {
        this.errorText = error.message || error.msg || "获取异常选项错误";
      });


    },
    isSelect() {
      if (this.question.length == 0) {
        return true;
      }
      if (window.innerWidth <= 320) {
        return true;
      }

      if (this.question.length >= 10) {
        return true;
      }
    },
    input() {
      if (this.form.problem != this.other) {
        this.form.problem = this.other;
      }

      const textarea = this.$refs.textarea.$el.childNodes[0];

      if (textarea.clientHeight < textarea.scrollHeight) {
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    },
    onSubmit() {
      new Promise(resolve => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve();
          } else {
            return false;
          }
        });
      })
        .then(() => {
          return this.$confirm("您确认要提交维修申报吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          });
        })
        .then(() => {
          const { tid } = this;
          const { mid } = this.search;
          let { name, equipment, describe, problem } = this.form;
          const typename = this.question[problem];

          // 如果选中的不是其他问题，那么就不提交问题描述
          if (problem != this.other) {
            describe = "";
          }

          addProblem(name, mid, tid, equipment, typename, describe)
            .then(() => {
              this.submit = true;
              this.$alert("维修申报提交成功", "完成", {
                confirmButtonText: "确定",
                type: "success",
                center: true
              });
            })
            .catch(() => {

              this.$alert("提交失败，请重试", "错误", {
                confirmButtonText: "确定",
                type: "error",
                center: true
              });

            });
        });
    },
    toApp(app, search) {


      addToUrlCount(app.id, this.form.name).then(() => {
        location.href = app.url;
      });
      setTimeout(() => {
        location.href = app.url;
      }, 500)





      return;

      let toUrl = location.origin + `/ding/${app}/index.html?corpId=` + this.search.corpId;
      if (search) {
        if (search.charAt(0) != "&") {
          search = "&" + search;
        }
        toUrl += search
      }

      location.href = toUrl

    },
    onClickUrlMore() {
      this.showToUrls.splice(0, this.showToUrls.length, ...this.toUrls.data)
      this.toUrls.order = false
    }

  },
  mounted() {
    // console.log((window.innerHeight - document.body.clientHeight) / 40);
  },
  beforeDestroy() { },
  destroyed() { }
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

body {
  padding: 10px;
  padding-top: 20px;
}

#app {
  max-width: 800px;
  margin: auto;
  position: relative;
  height: 100%;

  display: flex;
  flex-direction: column;


  .el-form {
    position: relative;
  }

  .el-result {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: white;
  }

  .title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: white;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: rgb(102, 177, 255);
  }

  form {
    box-shadow: 0 -2px 4px rgb(0 0 0 / 12%), 0 2px 6px rgb(0 0 0 / 12%);
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: white;
    color: #606266;
  }

  .el-radio-group {
    width: 100%;

    label {
      margin: 0px;
      margin-right: 5px;
      margin-bottom: 10px;
    }
  }

  .el-select {
    width: 100%;
  }

  .el-input input {

    height: 35px;
    line-height: 35px;

    color: black !important;
    -webkit-opacity: 1 !important;
    opacity: 1 !important;
  }

  .submit-button.el-button {
    margin: auto;
    margin-top: 20px;
  }

  .el-input__inner {
    padding: 0 5px;
  }

  .el-textarea__inner {
    padding: 5px;
  }

  textarea {
    height: 100px;
    resize: none;
  }

  .toa-view {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: flex-end;

    div {
      width: 100%;
      flex-wrap: wrap;
      margin-top: 10px;

    }

    .el-button {

      margin: 0 10px 10px 0;
    }


    a:not(:last-child) {
      margin-right: 20px;
    }

  }
}
</style>
