import { defineStore } from "pinia";
import { getShowName, getSelectAtt, getSelectAttributeObject, getDefautlDayArray } from "@/utils/other"





interface State {
    data: Map<Time, dateFoodCard>

    delData: Map<Time, dateFoodCard>

    foodNum: number,
    packNum: number,
    stopStorage: boolean,

    isCach: boolean
}

const state: State = {
    data: new Map<Time, dateFoodCard>(),

    delData: new Map<Time, dateFoodCard>(),

    packNum: 0,
    foodNum: 0,
    stopStorage: false,

    /** 是否缓存添加数据 */
    isCach: false
}


const localKey = "newEatMealAppTemp"
const eventList = [];

/**
 * 通过菜品的口味属性，影响价格的属性来判断两个菜品是否一致
 * @param a 
 * @param b 
 * @returns 
 */
function equalAttr(a: foodCard, b: foodCard) {

    /** 因为没有属性，比如返回真 */
    if (a.attributes.length == 0 && b.attributes.length == 0 && a.specFoods.length == 0 && b.specFoods.length == 0) {
        return true;
    }

    let retBool = false;

    if (a.attributes.length == b.attributes.length) {
        /**
         * 
         * 如果两个菜品都有口味属性
         * 那就判断它们当前是选中的属性是否一致
         * 
         */
        retBool = a.attributes.every((elem, index) => elem.details[0].name === b.attributes[index].details[0].name)
    } else {
        retBool = false;
    }


    if (retBool && a.specFoods.length == b.specFoods.length) {
        /**
         * 
         * 如果两个菜品都有影响价格的属性
         * 那就判断它们当前是选中的属性是否一致
         * 
         */
        retBool = a.specFoods.every((elem, index) => elem.details[0].name === b.specFoods[index].details[0].name)

    } else {
        retBool = false
    }

    return retBool;

}



const store = defineStore("cart", {
    state() {
        window.cart = state;
        return state
    },
    getters: {
        /** 是否全部打包 */
        allPack(): boolean {


            let { foodNum, packNum } = this;

            if (foodNum > 0) {

                for (const [time, data] of this.data.entries()) {

                    if (time.disabled) {
                        const alldata = [].concat(...(data as any));


                        alldata.forEach((elem:any)=>{

                            packNum -= elem.pack ? 1: 0;
                        })

                        foodNum -= alldata.length;

                    }

                }


            }


            return foodNum > 0 && foodNum === packNum;
        },

        /** 平坦化所有已点的菜单 */
        flattenFood(): foodCard[] {

            const retArr: foodCard[] = [];

            [...this.data.values()].forEach((foodItem) => {

                foodItem.forEach((MealItem) => {
                    MealItem.forEach((elem) => {
                        retArr.push(elem);
                    })
                })
            })

            return retArr;
        },
        dot(): boolean {
            return this.flattenFood.length == 0 ? false : this.flattenFood.some(elem => !elem.submit);
        }
    },
    actions: {

        /** 设置全部打包的选中 */
        setAllPack(value: boolean) {

            if (this.foodNum == 0) {
                return;
            }

            this.flattenFood.forEach((elem) => {
                if (elem.pack != value) {
                    this.changePackFood(elem, value);
                }
            })

        },

        /** 设置全部菜品是否已提交 */
        setAllSubmit(value: boolean) {

            if (this.foodNum == 0) {
                return;
            }

            this.flattenFood.forEach((elem) => {
                elem.submit = value;
            })

        },

        /** 设置全部菜品是否新加入 */
        setAllNewAdd(value: boolean) {

            if (this.foodNum == 0) {
                return;
            }

            this.flattenFood.forEach((elem) => {
                elem.isNewAdd = value;
            })

        },

        /** 修改某个菜品的打包状态 */
        changePackFood(item: foodCard, value: boolean) {


            item.pack = value;
            item.submit = false;
            this.packNum += value ? 1 : -1;
        },

        /**
         * 加入商品到购物车上去
         * @param YMD 年月日
         * @param Time 时间段，早中晚夜宵
         * @param addFood 菜品
         * @param addNum 数量
         */
        addDateFoot(YMD: Time, Time: MealTime, addFood: reFood, attributes: attribute[], specFoods: SpecFood[], addNum: number, options?: any) {

            if (!options || typeof options != "object") {
                options = {};
            }

            /** 取出当天是否有加购过菜品 */
            let dateCart = this.data.get(YMD)!;
            if (!dateCart) {
                dateCart = (getDefautlDayArray() as any);

                this.data.set(YMD, dateCart);
            }

            /** 先取出它在哪一天哪一时间段，是否有加购过这个菜 */
            let oldFoodArr: foodCard[] = [];
            if (dateCart[Time]) {
                oldFoodArr = dateCart[Time].filter((elem) => elem.food === addFood);
            }

            const arrt: foodCard = {
                food: addFood,
                pack: options.pack || false,
                submit: options.submit || false,
                num: addNum,

                attributes,
                specFoods,

                price: addFood.showPrice,
                name: getShowName(addFood.name, attributes, specFoods),

                mealTime: Time,

                isNewAdd: false

            }


            let oldFoodItem: foodCard | undefined;
            if (oldFoodArr.length > 0) {
                oldFoodItem = oldFoodArr.find((elem) => equalAttr(arrt, elem))
            }




            if (oldFoodItem) {
                /** 如果已经加购过这个菜，且菜的属性完全一直，那么只需要增加数量即可 */
                oldFoodItem.num += addNum;
                oldFoodItem.submit = false;

                if (oldFoodItem.num == 0) {
                    const findIndex = dateCart[Time].findIndex((elem) => elem === oldFoodItem)!
                    dateCart[Time].splice(findIndex, 1);

                    this.foodNum -= 1;
                    if (oldFoodItem.pack) {
                        this.changePackFood(oldFoodItem, false);
                    }

                    /** 如果它不是在这一次新增的话，那么就加入删除列表中 */
                    if (!oldFoodItem.isNewAdd) {

                        let delCart = this.delData.get(YMD)!;
                        if (!delCart) {
                            delCart = (getDefautlDayArray() as any);
                            this.delData.set(YMD, delCart);
                        }

                        delCart[Time].push(oldFoodItem);

                    }


                }

            } else {


                if (!this.isCach) {
                    arrt.isNewAdd = true;
                }

                /** 没有加购这个菜，或者加购其他输出，那么就添加进去 */
                dateCart[Time] = dateCart[Time] || [];
                dateCart[Time].push(arrt);



                this.foodNum += 1;
                if (arrt.pack) {
                    this.packNum += 1;
                }

            }


            addFood.cartNum += addNum;
            if (addFood.cartNum == 0) {

                const index = dateCart[Time].indexOf(oldFoodItem!);
                if (index > -1) {
                    dateCart[Time].splice(index, 1);
                }
                if (dateCart[Time].length == 0) {

                    if (dateCart.every((elem) => elem.length == 0)) {
                        this.data.delete(YMD)!;
                    }
                }

            }

        },
        findDateFoot(YMD: Time, Time: MealTime, addFood: reFood, attributes: attribute[], specFoods: SpecFood[]) {

            const dateCart = this.data.get(YMD);
            if (!dateCart) {
                return
            }

            const oldFoodArr = dateCart[Time].filter((elem) => elem.food === addFood);
            if (!oldFoodArr) {
                return
            }

            return oldFoodArr.find((elem) => equalAttr({
                attributes,
                specFoods
            } as any, elem))

        },
        /** 保存当前未提交的数据 */
        saveStorage() {
            if (this.stopStorage) {
                return
            }

            let saveObj: any = {};

            try {
                saveObj = JSON.parse(localStorage.getItem(localKey)!) || {};
            } catch {
                saveObj = {};
            }

            this.data.forEach((dataItem, dayTime) => {

                if (dayTime.disabled) {
                    return;
                }

                saveObj[dayTime.YMD] = dataItem.map((elem) => {

                    const data = JSON.parse(JSON.stringify(elem)).map((dayFoodItem: foodCard) => {

                        dayFoodItem.food = {
                            name: dayFoodItem.food.name,
                            type: dayFoodItem.food.type
                        } as any

                        return dayFoodItem
                    });

                    return data

                })

            })

            localStorage.setItem(localKey, JSON.stringify(saveObj))

        },
        clearStorage() {
            localStorage.setItem(localKey, "{}");
        },

        /**
         * 加载指定日期的历史纪录
         * @param day 
         * @param foods 当天的菜品对象
         */
        loadStorage(day: Time, foods: typeFood) {


            this.isCach = true;

            try {
                const tempCart = JSON.parse(localStorage.getItem(localKey)!)[day.YMD] as dateFoodCard


                tempCart.forEach((elem, mealTime) => {
                    if (!elem) {
                        return;
                    }

                    elem.forEach((cacheFoodItem) => {


                        for (let index = 0; index < foods[mealTime].length; index++) {

                            const element = foods[mealTime][index];

                            /** 先判断类型是否一致 */
                            if (element.name == cacheFoodItem.food.type) {

                                /** 在菜品数组中找到同样的菜 */
                                const findFood = element.data.find((foodItem) => foodItem.name === cacheFoodItem.food.name)
                                if (findFood) {
                                    /** 取出缓存菜品的属性 */
                                    const { attributes, specFoods } = cacheFoodItem;

                                    /** 查找一下购物车里是否有相同的菜品 */
                                    const oldItem = this.findDateFoot(day, mealTime, findFood, attributes, specFoods);



                                    let add = false;
                                    /** 如果有相同的菜品，那就把它给删除掉 */
                                    if (oldItem) {

                                        /** 
                                         * 只有在缓存数量大于已经点过的数量的时候
                                         * 才会添加缓存菜品
                                         */
                                        if (oldItem.num < cacheFoodItem.num) {

                                            add = true;
                                            this.addDateFoot(day, mealTime, findFood, attributes, specFoods, -oldItem.num, cacheFoodItem)
                                        }

                                    } else {
                                        add = true;

                                    }
                                    if (add) {

                                        /** 再添加进去 */
                                        this.addDateFoot(day, mealTime, findFood, attributes, specFoods, cacheFoodItem.num, cacheFoodItem)

                                    }

                                }

                            }


                        }
                    })




                })


            } catch {

                const a = 100;

            }


            this.isCach = false;

        },

        /** 把上一次的购物记录添加进来 */
        setHistory(day: Time, foods: typeFood, historyItem: historyFood) {


            this.isCach = true;


            /** 分割名字，取出菜名和所有的属性 */
            function splitName(name: string) {
                const retVal = {
                    name,
                    attr: [] as string[]
                }

                const search = name.match(/\((.*)\)/)
                if (search) {
                    retVal.attr = search[1].split("/");
                    retVal.name = name.split(search[0])[0]
                }

                return retVal
            }

            /**
             * 
             * @param addList 要把属性添加进去的数组
             * @param list 当天菜品中的属性
             * @param attr 历史购物中的属性，是一个文本型数组
             */
            function findAttr(addList: attribute[], list: attribute[], attr: string[]) {


                /** 如果没有属性的话，就是一个"正常"的，那就把所有的属性左边给选中 */
                if (attr.length == 0) {
                    list.map((elem) => {
                        const cloneAttributes = JSON.parse(JSON.stringify(elem)) as typeof elem

                        cloneAttributes.details = [cloneAttributes.details[0]];
                        cloneAttributes.details[0].selected = true;
                        addList.push(cloneAttributes)
                    })

                } else {

                    /** 
                     * 
                     * 这里从find改成forEach
                     * 如果一个菜单有多个属性的话，使用find只会遍历了一个属性，导致添加的菜单会出问题
                     * 
                     */
                    list.forEach((attItem) => {

                        const findIndex = attItem.details.findIndex((detailItem) => attr.indexOf(detailItem.name) > -1)
                        const retBool = findIndex > -1;
                        if (retBool) {

                            /**
                             * 要先把选中先处理
                             * 因为有人会多选米饭的重量，比如在同一时间点了两份。二两和三两，三两和四两
                             * 
                             * 如果先克隆了 attItem 的话，就会出现第二个米饭没有选中的bug
                             * 没有选中后添加到购物车，就只会有 "米饭" 的商品。提交的话就会出现菜品已下架的问题
                             * 
                             */
                            attItem.details.forEach((temp, index) => {
                                temp.selected = index == findIndex;
                            })

                            const cloneAttributes = JSON.parse(JSON.stringify(attItem)) as typeof attItem
                            cloneAttributes.details = [cloneAttributes.details[findIndex]]
                            addList.push(cloneAttributes)

                        }


                    })
                }

            }


            historyItem.forEach((elem, mealTime) => {
                if (elem.length == 0) {
                    return;
                }


                elem.forEach((item) => {

                    const attArr = splitName(item.name);


                    for (let index = 0; index < foods[mealTime].length; index++) {
                        const element = foods[mealTime][index];

                        /** 通过名字找到相同的菜品 */
                        const findFoodItem = element.data.find(elem => elem.name == attArr.name);
                        if (findFoodItem) {

                            const attributes = [] as attribute[];
                            const specFoods = [] as SpecFood[];

                            /** 找出点选的属性 */
                            findAttr(attributes, findFoodItem.attributes, attArr.attr);

                            /** 找出点选的会影响价格属性 */
                            if (attArr.attr.length > 0) {
                                findAttr(specFoods, findFoodItem.specFoods, attArr.attr);
                            }

                            /** 添加菜品 */
                            this.addDateFoot(day, mealTime, findFoodItem, attributes, specFoods, item.weight, {
                                pack: item.pack,
                                submit: true
                            });

                            break;
                        }

                    }


                })

            })


            this.isCach = false;


        },
        /** 清空某一天的历史记录 */
        clearDayStorage(day: Time) {
            try {

                const tempCart = JSON.parse(localStorage.getItem(localKey)!)

                delete tempCart[day.YMD];
                localStorage.setItem(localKey, JSON.stringify(tempCart));

            } catch {
                return;
            }

        },

        /** 获取全部的待删除 */
        getDelData() {

            const retObj: any = {};
            for (const [time, data] of this.delData.entries()) {


                const dateObg = retObj[time.YMD] = retObj[time.YMD] || {};


                data.forEach((elem, timeIndex) => {

                    if (elem.length == 0) {
                        return;
                    }


                    timeIndex += 1;
                    const dataArr = dateObg[timeIndex] = dateObg[timeIndex] || new Set();

                    elem.forEach((item) => {
                        dataArr.add(item.name);
                    })

                    dateObg[timeIndex] = [...dataArr];

                })

            }

            return retObj;

        },

        /** 清空待删除的数据 */
        clearDelData() {

            this.delData.clear();
        }

    }
})


export default store;

export function addFoodchange(call: any) {
    eventList.push(call);
}
