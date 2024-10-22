import { defineStore } from "pinia";
import { orderStore } from "./order";
import { timeStore } from "./time"


interface STATE {
    data: Record<string, foodData>
}

const state: STATE = {
    data: {

    }
}

let id = 1;
export const foodStore = defineStore("food", {
    state() {
        return state;
    },
    actions: {
        /**
         * 取某一天是否没获取数据
         * @param date 
         * @returns 
         */
        isEmpty(date: string): boolean {
            return !!this.data[date]
        },

        /** 请求接口获取的菜品，需要通过这个函数来放进去 */
        setFoods(date: string, items: foodData) {


            const sortType = ["主食", "菜", "汤", "小吃", "蔬菜"];
            items.forEach((elem) => {
                const sortArr: typeItems = [];
                const noSotr: typeItems = [];


                /**
                 * 先排序，排序的顺序上面用变量声明
                 */
                elem.forEach((timeData) => {

                    const index = sortType.indexOf(timeData.name);
                    if (index == -1) {
                        noSotr.push(timeData);
                    } else {
                        sortArr[index] = timeData;
                    }
                })

                const sortResult = sortArr.concat(noSotr).filter((a) => !!a);


                /** 然后再给每一个菜添加必要属性 */
                sortResult.forEach((timeData) => {

                    timeData.data.forEach((food) => {

                        food.num = 0;
                        food.token = id++;
                        food.type = timeData.name;

                        food.prop.forEach((prop) => {
                            prop.parent = food;
                        })


                        if(!food.id){
                            food.id = food.prop[0].fid
                        }

                    })
                })

                elem.splice(0, elem.length, ...sortResult);


            })

            
            this.data[date] = items;


        },

        /**
         * 设置某一天已经点餐的记录
         * @param date 日期
         * @param shop 
         * @returns 
         */
        setOrder(date: string, shop: Array<orderItems>) {
            const order = orderStore();
            const time = timeStore();

            // if(time.getDateEnd(date)){
            //     return;
            // }

            shop.forEach((value, time) => {

                value.forEach((item) => {

                    let itemName: string;
                    let propName = "正常";

                    let foodItem: foodItem | undefined;
                    let taste: propItem;

                    const match = item.name.match(/(.*?)\((.*?)\)/);

                    if (match) {
                        itemName = match[1];
                        propName = match[2]

                    } else {
                        itemName = item.name;
                    }

                    this.data[date][time].find((type) => {

                        return foodItem = type.data.find((food) => {
                            if(food.name == itemName){
                                return true
                            } else if( propName == "辣"  && food.name == `${itemName}[${propName}]`){
                                return true
                            }
                        });

                    });


                    if (foodItem!.prop.length == 1) {
                        taste = foodItem!.prop[0]
                    } else {
                        taste = foodItem!.prop.find((elem) => elem.prop == propName)!;
                    }

                    const orderFood = order.addFood(date, time, foodItem!, taste, item.weight || (item as any).qty,item.iscache)

                    orderFood.pack = item.pack;
                    if(orderFood.pack){
                        order.packLen.value += 1;
                    }

                })

            })



        }
    }
})
