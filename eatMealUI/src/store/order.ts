import { ref, reactive, nextTick } from "vue"
import { defineStore } from "pinia";
import { timeStore } from "@/store/time";
import { dotStore } from "@/store/dot";

import { Dialog } from 'vant';
import moment from "moment";




const state: Record<string, {
    num: number,
    data: Array<orderItems>,

}> = {

}

/**
 * 全部商品数量
 */
const length = ref(0);
/**
 * 需要打包的商品数量
 */
const packLen = ref(0);

const anchor = ref(0);

let writeIng = false;



/**
 * 日期绑定时间段
 * 时间段绑定商品
 * 商品绑定多个属性
 * 这样就可以通过日期和时间段，指定商品取出选中的所有属性
 */
const tokenMap = new Map<string, Array<Map<number, orderItems>>>();


export const orderStore = defineStore("order", {
    state() {
        return state
    },
    getters: {
        length() {
            return length
        },
        packLen() {
            return packLen
        },
        anchor() {
            return anchor
        },

        /**
         * 获取所有未过期日期的数据
         * @returns 
         */
        dataList() {
            const time = timeStore();
            // 这里的length主要是加一个引用，用来保证它是最新的值
            if (length.value > 0) {
                const ss = 100;
            }
            return time.date.filter((elem) => {
                return !!(this as any)[elem.str] && !time.getDateEnd(elem.str)
            });
        }
    },

    actions: {
        /**
         * 添加商品
         * @param date 日期 
         * @param time 时间段
         * @param item 菜品
         * @param taste 属性/口味
         * @param weight 商品数量
         */
        addFood(date: string, time: number, item: foodItem, taste: propItem, weight: number,iscache?:boolean) {
            const dot = dotStore();

            let bindMap: any;
            if (this[date] == null) {
                this[date] = {
                    num: 0,
                    data: []
                };
            }

            if (this[date].data[time] == null) {
                this[date].data[time] = [];
            }


            bindMap = tokenMap.get(date);
            if (!bindMap) {
                bindMap = [];
                tokenMap.set(date, bindMap);
            }
            if (!bindMap[time]) {
                bindMap[time] = new Map<number, orderItems>();
            }


            const foods = this[date].data[time];
            let orderFood = this.getDateFood(date, time, item).find((elem) => {
                return elem.taste == taste
            });

            if (orderFood) {
                orderFood.weight += weight;
                orderFood.iscache = true;
            } else {
                this[date].num += 1

                length.value += 1;
                orderFood = {
                    id: 0,
                    token: item.token,
                    name: item.name,
                    pack: false,
                    weight,
                    taste,
                    iscache:iscache
                };

                foods.push(orderFood);

                const bindFood = bindMap[time].get(item.token);
                if (bindFood) {
                    bindFood.push(orderFood);
                } else {
                    bindMap[time].set(item.token, reactive([orderFood]));
                }

            }
            if (item.qty > 0 && orderFood!.weight > item.qty) {
                Dialog.alert({
                    message: `${item.name} 库存仅剩下 ${item.qty} 份`
                });
                item.num = item.qty;
                orderFood!.weight = item.num
            } else {
                item.num += weight
            }


            dot.set(date, time, false);
            dot.submit[0] = true;

            this.writePostData();

            return orderFood

        },

        /**
         * 给指定商品减少一份
         * @param date 日期 
         * @param time 时间段
         * @param item 菜品
         * @param taste 属性/口味
         * @param weight 商品数量
         */
        delFood(date: string, time: number, item: foodItem, taste: propItem) {

            const dot = dotStore();
            const bindFood = this.getDateFood(date, time, item)!;
            const index = bindFood.findIndex((elem) => {
                return elem.taste == taste
            })!;

            const orderFood = bindFood[index];

            orderFood.weight -= 1;
            orderFood.iscache = true;
            item.num -= 1;

            if (orderFood.weight <= 0) {
                bindFood.splice(index, 1);

                const dataIndex = this[date].data[time].findIndex((elem) => {
                    return elem.taste == taste
                })!;

                this[date].data[time].splice(dataIndex, 1);

                this[date].num -= 1
                length.value -= 1;


                if (this[date].data[time].length == 0) {
                    dot.set(date, time, true);
                }
            }

            dot.submit[0] = true;

            this.writePostData();

        },

        /**
         * 取出指定日期指定时间段某个菜的
         * @param date 日期
         * @param time 时间段
         * @param item 菜品
         */
        getDateFood(date: string, time: number, item: foodItem) {

            try {
                return tokenMap.get(date)![time].get(item.token) || [];
            } catch (error) {
                return [];
            }
        },

        /**
         * 获取某件商品在指定日期某个时间段选购的数量
         * @param date 
         * @param time 
         * @param item 
         * @returns 
         */
        getFoodNum(date: string, time: number, item: foodItem) {
            return this.getDateFood(date, time, item).reduce((val, elem) => {
                return val + elem.weight
            }, 0)
        },

        getFood(date: string, item: foodItem) {
            const time = timeStore();

            return time.time.map((str, index) => {
                const elem = this[date].data[index] || [];

                return elem.filter((f) => {
                    return f.token == item.token
                })
            })

        },

        getDayNum(date: string, item: foodItem) {
            try {
                return this.getFood(date, item).reduce((val, elem) => {
                    return val + elem.reduce((num, elem) => {
                        return num + elem.weight
                    }, 0)
                }, 0)
            } catch (error) {
                return 0;
            }

        },

        setAnchor(val: number) {
            anchor.value = val;
        },

        actionPrompt(message: string) {
            return Dialog.confirm({
                message
            })
        },

        /** 弹窗提示是否增加数量 */
        addActionPrompt() {
            return this.actionPrompt("是否增加数量？");
        },

        /** 生成提交数据 */
        generatePostData() {

            const postMap = {} as any;

            this.dataList.forEach((elem) => {
                const obj = postMap[elem.date] = {} as any;

                this[elem.str].data.forEach((item, index) => {
                    if (item.length == 0) {
                        return;
                    }

                    obj[index + 1] = item.map((food) => {
                        let name = food.name;
                        const taste = food.taste.prop;

                        if (taste != null && taste != "正常") {
                            name += `(${taste})`
                        }

                        return {
                            name,
                            pack: food.pack,
                            qty: food.weight
                        }

                    })

                })
            })

            return postMap;
        },

        /** 写数据 */
        writePostData() {
            if(writeIng == false){
                nextTick(() => {
                    localStorage.setItem("eatMealAppTemp", JSON.stringify(this.generatePostData()));
                    writeIng = false;
                })

                writeIng = true;
            }

        },
        /** 读数据 */
        readPostData() {
            try{
                return JSON.parse(localStorage.getItem("eatMealAppTemp")!) || {};
            }catch(error){
                return {}
            }
        },
        clearPostData() {
            localStorage.setItem("eatMealAppTemp", `{}`);
        }
    }
})



