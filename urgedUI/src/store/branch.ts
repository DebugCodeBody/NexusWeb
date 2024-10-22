import { getBranch } from "@/api"
import { ref, reactive, nextTick, watch, computed, shallowRef } from "vue";


/**
 * 部门列表
 */
const branch = shallowRef<branchs>([]);


const branchMap: Record<string, branch> = {};

/**
 * 选中的部门
 */
const selectBranch = ref<branch>({} as branch);
/**
 * 选择部门弹窗开关
 */
const branchDrawer = ref(false);

/**
 * 选中部门显示的名字
 */
const selectName = ref(String.Empty);


/**
 * 切换部门弹窗开关
 * 如果第一个参数不为空，则将参数赋值给选中部门
 * @param branch 
 */
const branchSwitch = function (branch?: branch) {
    branchDrawer.value = !branchDrawer.value;
    if (branch) {
        selectBranch.value = branch;
    }
}

/**
 * 后端返回来的部门需要处理一次才可以正常使用
 * @param data 
 * @param parent 
 */
function structure(data: branchs = [], parent?: branch) {
    data.forEach((elem) => {
        if (parent) {
            elem.parent = parent
        }

        branchMap[elem.deptname] = elem;

        structure(elem.children, elem);
    })

}


/**
 * 获取所有部门
 * @returns 
 */
async function branchInit() {

    if (branch.value.length > 0) {
        return;
    }
    try {
        const result = await getBranch();
        structure(result)

        branch.value.push(...result);

    } catch (error) {
        console.log(error);
    }

}

/**
 * 显示部门用的字符串
 */
watch(selectBranch, (value) => {
    if (value.deptname == undefined) {
        selectName.value = String.Empty;
        return;
    }

    if (!value.parent || value.parent.deptname == value.deptname) {
        selectName.value = selectBranch.value.deptname
    } else {
        selectName.value = [value.parent.deptname, value.deptname].join(" / ")
    }
    
})




export {

    branch,
    branchDrawer,
    selectBranch,
    branchSwitch,

    selectName,
    branchInit,
    branchMap

}









