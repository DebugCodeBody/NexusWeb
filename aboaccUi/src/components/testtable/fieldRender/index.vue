<template>
    <div class="table-field-render">
        <!-- Icon -->
        <Icon class="ba-icon-dark" v-if="field.render == 'icon'" :name="fieldValue ? fieldValue : field.default ?? ''" />

        <el-switch v-if="field.render == 'switch'" @change="changeField($event, property)"
            :model-value="fieldValue.toString()" :loading="row.loading" active-value="1" inactive-value="0" />
        <!-- image -->
        <div v-if="field.render == 'image' && fieldValue" class="ba-render-image">
            <el-image :preview-teleported="true" :preview-src-list="[fullUrl(fieldValue)]"
                :src="fullUrl(fieldValue)"></el-image>
        </div>

        <!-- images -->
        <div v-if="field.render == 'images'" class="ba-render-image">
            <template v-if="Array.isArray(fieldValue) && fieldValue.length">
                <el-image v-for="(item, idx) in fieldValue" :key="idx" :initial-index="idx" :preview-teleported="true"
                    :preview-src-list="arrayFullUrl(fieldValue)" class="images-item" :src="fullUrl(item)"></el-image>
            </template>
        </div>

        <!-- tag -->
        <div v-if="field.render == 'tag' && fieldValue !== ''">
            <el-tag :type="getTagType(fieldValue, field.custom)" :effect="field.effect ?? 'light'" :size="field.size">{{
                field.replaceValue ? field.replaceValue[fieldValue] : fieldValue
            }}</el-tag>
        </div>
        <!-- tags -->
        <div v-if="field.render == 'tags'">

            <template v-if="Array.isArray(fieldValue)">
                <template v-for="(tag, idx) in fieldValue">
                    <el-tag v-if="tag" class="m-10" :type="getTagType(tag, field.custom)" :effect="field.effect ?? 'light'"
                        :size="field.size ?? 'default'" :key="idx">
                        {{ field.replaceValue ? field.replaceValue[tag] ?? tag : tag }}</el-tag>
                </template>
            </template>

            <template v-else>
                <el-tag class="m-10" v-if="fieldValue !== ''" :type="getTagType(fieldValue, field.custom)"
                    :effect="field.effect ?? 'light'" :size="field.size ?? 'default'">
                    {{ field.replaceValue ? field.replaceValue[fieldValue] ?? fieldValue : fieldValue }}</el-tag>
            </template>

        </div>

        <div v-if="field.render == 'url' && fieldValue">
            <el-input :model-value="fieldValue" :placeholder="baTable.I18n('Link address')">
                <template #append>
                    <el-button
                        @click="typeof field.click == 'function' ? field.click(fieldValue, field) : openUrl(fieldValue, field)">
                        <!-- <Icon :color="'#606266'" name="el-icon-Position" /> -->
                    </el-button>
                </template>
            </el-input>
        </div>

        <div v-if="field.render == 'datetime'">
            {{ !fieldValue ? '-' : timeFormat(fieldValue, field.timeFormat ?? undefined) }}
        </div>

        <!-- customTemplate 自定义模板 -->
        <div v-if="field.render == 'customTemplate'"
            v-html="field.customTemplate ? field.customTemplate(row, field, fieldValue) : ''"></div>

        <!-- 自定义组件/函数渲染 -->
        <component 
            v-if="field.render == 'customRender'" 
            :is="field.customRender" 
            :renderRow="row" 
            :renderField="field"
            :renderValue="fieldValue" />

        <!-- 按钮组 -->
        <div 
            v-if="field.render == 'buttons' && field.buttons"
            style="display: flex; justify-content:center; align-items:center">

            <template 
                v-for="(btn, idx) in field.buttons">
                <div v-if="btn.display ? btn.display(row, field) : true" :key="idx">

                    <el-tooltip 
                        v-if="btn.render == 'tipButton'" 
                        :disabled="btn.npTooltip"
                        :content="btn.title ? baTable.I18n(btn.title) : ''" 
                        placement="top">

                        <el-button 
                            v-if="btn.name == 'edit' && baTable.auth('edit')" 
                             
                            @click="onButtonClick(btn)"
                            :class="btn.class" 
                            class="table-operate" 
                            :type="btn.type">
                            <Icon :name="btn.icon" />
                            <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                        </el-button>
                        <el-button v-else 
                             
                            @click="onButtonClick(btn)" 
                            :class="btn.class" 
                            class="table-operate"
                            :type="btn.type">
                            <Icon :name="btn.icon" />
                            <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                        </el-button>
                    </el-tooltip>

                    <el-popconfirm 
                        v-if="btn.render == 'confirmButton'" 
                        v-bind="btn.popconfirm"
                        @confirm="onButtonClick(btn)">
                        <template #reference>
                            <div class="ml-6">
                                <el-tooltip 
                                    :disabled="btn.npTooltip" 
                                    :content="btn.title ? baTable.I18n(btn.title) : ''"
                                    placement="top">
                                    <el-button 
                                        v-if="btn.name == 'delete' && baTable.auth('del')" 
                                         
                                        :class="btn.class"
                                        class="table-operate" 
                                        :type="btn.type">
                                        <Icon :name="btn.icon" />
                                        <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                                    </el-button>
                                    <el-button v-else  :class="btn.class" class="table-operate" :type="btn.type">
                                        <Icon :name="btn.icon" />
                                        <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-popconfirm>
                    <el-tooltip 
                        v-if="btn.render == 'moveButton'" 
                        :disabled="btn.npTooltip"
                        :content="btn.title ? baTable.I18n(btn.title) : ''" 
                        placement="top">
                        <el-button 
                            v-if="btn.name == 'weigh-sort' && baTable.auth('sortable')" 
                            :class="btn.class"
                            class="table-operate move-button" 
                            :type="btn.type">
                            <Icon :name="btn.icon" />
                            <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                        </el-button>
                        <el-button v-else 
                             
                            :class="btn.class" 
                            class="table-operate move-button" :type="btn.type">
                            <Icon :name="btn.icon" />
                            <div v-if="btn.text" class="table-operate-text">{{ btn.text }}</div>
                        </el-button>
                    </el-tooltip>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import Icon from "../components/icon.vue"

import { timeFormat, openUrl } from '../utils/index'
import { fullUrl, arrayFullUrl } from '../utils/common'
import { testBaTable } from '../utils/baTable'

import type { Tag } from 'element-ui'


const baTable = inject<testBaTable>('baTable')!;

interface Props {
    row: TableRow
    field: TableColumn
    // 字段名
    property?: string
}

const props = withDefaults(defineProps<Props>(), {
    row: () => [],
    field: () => {
        return {}
    },
    property: '',
})


// 字段值(单元格值)
// const fieldValue = ref(props.row[props.property])
const fieldValue = computed(() => {
    return props.row[props.property!];
})


// if (props.property.indexOf('.') > -1) {
//     let fieldNameArr = props.property.split('.')
//     let val: any = ref(props.row[fieldNameArr[0]])
//     for (let index = 1; index < fieldNameArr.length; index++) {
//         val.value = val.value ? val.value[fieldNameArr[index]] ?? '' : ''
//     }
//     fieldValue.value = val.value
// }

// if (props.field.renderFormatter && typeof props.field.renderFormatter == 'function') {
//     fieldValue.value = props.field.renderFormatter(props.row, props.field, fieldValue.value)
// }

const changeField = (value: any, fieldName: keyof TableRow) => {
    if (props.field.render == 'switch') {

        baTable.eventBus.emit('onTableFieldChange', {
            value: value,
            row: props.row,
            field: fieldName,
            render: props.field.render,
        })
    }
}

const onButtonClick = (btn: OptButton) => {
    baTable.table.selectRow = props.row;


    if (typeof btn.click === 'function') {
        btn.click(props.row, props.field)
        return
    }
    if (btn.name == "edit") {
        onClickEdit();
    } else if (btn.name == "delete") {
        onClickDelete();
    } else {
        baTable.eventBus.emit('onTableButtonClick', {
            name: btn.name,
            row: props.row,
        })
    }
}

function onClickEdit() {
    baTable.Edit(props.row);
}

function onClickDelete() {
    baTable.Delete(props.row);
}


const getTagType = (value: string, custom: any): Tag['type'] => {
    return custom && custom[value] ? custom[value] : ''
}
</script>

<style lang="scss">
.table-field-render {

    .m-10 {
        margin: 4px;
    }

    .ba-render-image {
        text-align: center;
    }

    .images-item {
        width: 50px;
        margin: 0 5px;
    }

    .el-image {
        height: 36px;
        width: 36px;
    }

    .table-operate-text {
        padding-left: 5px;
    }

    .table-operate {
        padding: 4px 5px;
        height: auto;
    }

    .table-operate .icon {
        font-size: 14px !important;
    }

    .move-button {
        cursor: move;
    }

    .ml-6 {
        display: inline-flex;
        vertical-align: middle;
        margin-left: 6px;
    }

    .ml-6+.el-button {
        margin-left: 6px;
    }

}
</style>
