
import storage from "@/utils/Storage"

/** 所有工艺列表 */
const technologyArr = {
    arr: ref(['车床', '雕刻', '普铣', '线割', '打火花', '电脑锣', '车床打样', '铣床打样', '线割打样', '电脑锣打样', '二楼钻攻批量', '电脑锣一楼钢件']),
    storage: new storage("technolog", "")
};





export {
    technologyArr
}