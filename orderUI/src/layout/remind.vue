<template>
    <van-radio-group v-model="radio">

        <van-cell-group inset @click="onGroupClick">
            <van-cell title="默认提醒" clickable @click="radio = '1'">
                <template #right-icon>
                    <van-radio name="1" />
                </template>
            </van-cell>
            <van-cell title="永不提醒" clickable @click="radio = '2'">
                <template #right-icon>
                    <van-radio name="2" />
                </template>
            </van-cell>
            <van-cell title="指定日期不提醒" clickable @click="radio = '3'">
                <template #right-icon>
                    <van-radio name="3" />
                </template>
            </van-cell>
            <van-cell title="本周不提醒" clickable @click="radio = '4'">
                <template #right-icon>
                    <van-radio name="4" />
                </template>
            </van-cell>
            <van-cell title="本月不提醒" clickable @click="radio = '5'">
                <template #right-icon>
                    <van-radio name="5" />
                </template>
            </van-cell>
            <van-cell>
                <van-button type="info" block round style="margin-top: 20px;" @click.stop="set"
                    :disabled="submitDisabled">提交
                </van-button>
            </van-cell>

        </van-cell-group>

        <van-cell-group inset style="margin-top: 20px;">
            <van-cell>
                <span>如果在食堂<strong style="color:red; ">截止</strong>点菜之前，发现你没有进行点餐，将会通过<strong
                        style="color:red; ">电话</strong>询问你是否遗忘了点餐</span>
            </van-cell>
        </van-cell-group>


        <van-popup v-model="popupShow" position="bottom" :style="{ height: '50%' }" @close="cancelPopup">
            <div class="date-popup">
                <van-checkbox-group v-model="selectDate">
                    <van-cell-group>
                        <van-cell v-for="(item, index) in list" clickable :key="item.week"
                            :title="`${item.date} ${item.week}`" @click="toggle(index)">
                            <template #right-icon>
                                <van-checkbox :name="item.date" ref="checkboxes" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-checkbox-group>
                <van-row gutter="10">
                    <van-col span="12">
                        <van-button type="primary" block round @click="popupShow = false">取消
                        </van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button type="info" block round :disabled="selectDate.length == 0" @click="donePopup">确定
                        </van-button>
                    </van-col>
                </van-row>
            </div>

        </van-popup>

    </van-radio-group>



</template>

<script>
import { get, set } from "@/api/notice.js"

import moment from "moment";
import { Toast } from 'vant';

export default {
    name: "Remind",
    components: {},
    props: {
    },
    beforeCreate() {



    },
    created() {
        const empid = this.empid = this.$store.getters.userEmpid;

        get(empid).then((data) => {
            if (data == null) {
                this.responseRadio = this.lastRadio = this.radio = "1";
            } else {
                this.responseRadio = this.lastRadio = this.radio = `${data.model}`;


                this.responseTime = data.time
            }

            const time =  moment({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            let start;
            let end;

            if (this.radio == 3) {
                end = moment(data.time[data.time.length - 1]);
            } else if (["4", "5"].includes(this.radio)) {
                end = moment(data.time[1]);
            }
            if (end && end.diff(time, "days") <= 0) {
                this.radio = "1";
                this.responseTime = [];
            }

        })

    },
    beforeMount() { },
    data() {
        return {
            responseRadio: null,
            responseTime: [],
            lastRadio: null,
            radio: null,


            list: [],
            selectDate: [],
            popupShow: false
        };
    },
    watch: {
        radio(val, old) {
            this.lastRadio = old;
        }
    },
    computed: {
        submitDisabled() {
            return this.responseRadio == this.radio || !this.radio
        }
    },
    methods: {
        onGroupClick() {
            if (this.radio == 3) {
                this.popupShow = true;

                const time = moment({ hour: 0, minute: 0, second: 0, millisecond: 0 });
                const weekEnd = moment().endOf("week");

                let diff = weekEnd.diff(time, "days");


                if (diff == 0) {
                    time.add(1, "week");
                    diff = 7;
                }

                const timeList = [];
                for (let i = 0; i < diff; i++) {
                    const addTime = time.add(1, "days");

                    timeList.push({
                        date: addTime.format("YYYY-MM-DD"),
                        week: addTime.format("dddd")
                    })
                }

                this.list = timeList;

                const { responseTime } = this;
                if (responseTime.length > 0) {

                    this.selectDate = timeList.map(elem => elem.date).filter((elem) => {

                        return responseTime.includes(elem);

                    });

                    responseTime.length = 0;

                }
            }

        },
        toggle(index) {
            this.$refs.checkboxes[index].toggle();
        },
        cancelPopup() {
            if (!!this.lastRadio) {
                this.radio = this.lastRadio;
            }
        },
        donePopup() {
            this.popupShow = false;

            if (this.list.length == this.selectDate.length) {
                this.radio = "4"
                this.selectDate = [];
            }

            this.set();

        },
        set() {
            const { empid, radio, selectDate } = this;

            selectDate.map((elem) => {
                return moment(elem)
            }).sort(() => {

            })

            set(empid, radio, selectDate).then(() => {
                Toast.success('提交成功');
                this.responseRadio = this.radio;

            }).catch(() => {
                Toast.fail('提交失败');
            })

        }
    },
    mounted() { },
    beforeDestroy() { },
    destroyed() { }
};
</script>

<style lang="scss" scoped>
.date-popup {
    display: flex;
    flex-direction: column;
    height: 100%;

    .van-checkbox-group {
        flex: 1;
    }

    .van-row {
        padding: 10px;
    }
}
</style>

