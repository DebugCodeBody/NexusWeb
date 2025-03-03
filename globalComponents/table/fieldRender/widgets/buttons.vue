<template>
    <div class="box-cell-buttons">

        <template v-for="(btn, idx) in buttons">
            <div v-if="btn.display ? btn.display(renderRow, renderField) : true" :key="idx" class="buttons-item">

                <el-tooltip 
                    v-if="btn.render == 'tipButton'" 
                    :disabled="btn.npTooltip"
                    :content="btn.title ? boxTable.I18n(btn.title) : ''" 
                    placement="top">

                    <el-button 
                        v-if="btn.name == 'edit' && boxTable.auth('edit')" 
                        @click="onButtonClick(btn)"
                        :class="btn.class" 
                        class="table-operate" 
                        :type="btn.type">
                        <div class="icon-button">
                            <pencil />
                        </div>
                        <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                    </el-button>
                    
                    <el-button v-else 
                        @click="onButtonClick(btn)" 
                        :class="btn.class" 
                        class="table-operate"
                        :type="btn.type">
                        <div class="icon-button">
                            <pencil />
                        </div>
                        <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                    </el-button>
                </el-tooltip>

                <el-popconfirm 
                    v-if="btn.render == 'confirmButton'" 
                    v-bind="btn.popconfirm"
                    @confirm="onButtonClick(btn)">
                    <template #reference>
                        <div >
                            <el-tooltip 
                                :disabled="btn.npTooltip" 
                                :content="btn.title ? boxTable.I18n(btn.title) : ''"
                                placement="top">
                                <el-button 
                                    v-if="btn.name == 'delete' && boxTable.auth('del')" 
                                    
                                    :class="btn.class"
                                    class="table-operate" 
                                    :type="btn.type">
                                    <div class="icon-button">
                                        <trashcan />
                                    </div>
                                    <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                                </el-button>
                                <el-button v-else :class="btn.class" class="table-operate" :type="btn.type">
                                    <div class="icon-button">
                                        <trashcan />
                                    </div>
                                    <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                                </el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-popconfirm>

                <el-tooltip 
                    v-if="btn.render == 'moveButton'" 
                    :disabled="btn.npTooltip"
                    :content="btn.title ? boxTable.I18n(btn.title) : ''" 
                    placement="top">
                    <el-button 
                        v-if="btn.name == 'weigh-sort' && boxTable.auth('sortable')" 
                        :class="btn.class"
                        class="table-operate move-button" 
                        :type="btn.type">
                        <div class="icon-button">
                            <arrows />
                        </div>
                        
                        <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                    </el-button>
                    <el-button v-else 
                        
                        :class="btn.class" 
                        class="table-operate move-button" :type="btn.type">
                        <div class="icon-button">
                            <arrows />
                        </div>
                        <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                    </el-button>
                </el-tooltip>

            </div>
        </template>
    </div>
</template>

<script setup lang="ts">

import pencil from "../../components/svg/pencil.vue"
import trashcan from "../../components/svg/trashcan.vue"
import arrows from "../../components/svg/arrows.vue"

import { boxTableControl, provideName } from '../../utils/boxTable'
 


const buttonList: {
    [key:string]: any
} = {
    "weigh-sort": {
        render: 'moveButton',
        name: 'weigh-sort',
        title: 'weigh-sort',
        text: '',
        type: 'info',
        class: 'table-button-sort',
        disabledTip: false,
    },
    "edit": {
        render: 'tipButton',
        name: 'edit',
        title: 'edit',
        text: '',
        type: 'primary',
        class: 'table-button-edit',
        disabledTip: false,
    },
    "delete": {
        render: 'confirmButton',
        name: 'delete',
        title: 'delete',
        text: '',
        type: 'danger',
        class: 'table-button-delete',
        popconfirm: {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            confirmButtonType: 'danger',
            title: "您确定要删除所选记录吗?",
        },
        disabledTip: false,
    }

}






const boxTable = inject<boxTableControl>(provideName)!;


const props = defineProps<{
    renderRow: Object
    renderField: TableColumn
    renderValue: String
}>()

const buttons = $computed(()=>{

    const forArr = props.renderField.buttons || [];
    const retArr = [] as any[];

    forArr.forEach((elem)=>{

        if(buttonList[elem]){
            retArr.push(buttonList[elem]);
        }
    })

    return retArr;

})



const onButtonClick = (btn: OptButton) => {
    boxTable.table.selectRow = props.renderRow;


    if (typeof btn.click === 'function') {
        btn.click(props.renderRow, props.renderField)
        return
    }
    if (btn.name == "edit") {
        onClickEdit();
    } else if (btn.name == "delete") {
        onClickDelete();
    } else {
        boxTable.eventBus.emit('onTableButtonClick', {
            name: btn.name,
            row: props.renderRow,
        })
    }
}

function onClickEdit() {
    boxTable.Edit(props.renderRow);
}

function onClickDelete() {
    boxTable.Delete(props.renderRow);
}

</script>

<style lang="scss">

.box-cell-buttons{
    svg{
        width: 14px;
    }

    .buttons-item{
        margin-right: 6px;

        &:last-child{
            margin-right: 0;
        }
    }
}
</style>
