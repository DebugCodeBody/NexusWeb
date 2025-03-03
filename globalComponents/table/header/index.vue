<template>
    <div class="bx-table-header">

        <!-- 操作按钮组 -->
        <div v-bind="$attrs" class="table-header">

            <el-tooltip 
                v-if="props.buttons.includes('refresh')" 
                :content="boxTable.I18n('refresh')" 
                placement="top"
                :disabled="npTooltip">
                <el-button v-blur 
                    @click="onClickRefresh" 
                    :size="size"
                    color="#40485b"
                    class="table-header-operate refresh" type="info" >
                    <div class="icon-button">
                        <Refresh />
                    </div>
                </el-button>
            </el-tooltip>

            <el-tooltip 
                v-if="props.buttons.includes('add') && boxTable.auth('add')" 
                :content="boxTable.I18n('add')"
                placement="top" 
                :disabled="npTooltip">
                <el-button 
                    v-blur 
                    @click="onClickAdd" 
                    class="table-header-operate" 
                    type="primary" 
                    :size="size"
                    :disabled="addDisabled">
                    <div class="icon-button">
                        <Plus v-if="!noIcon" />
                        <span class="table-header-operate-text">{{ boxTable.I18n('add') }}</span>
                    </div>
                </el-button>
            </el-tooltip>

            <el-tooltip 
                v-if="props.buttons.includes('edit') && boxTable.auth('edit')"
                :content="boxTable.I18n('Edit selected row')" 
                placement="top" 
                :disabled="npTooltip">
                <el-button 
                    v-blur 
                    @click="onClickEdit" 
                    class="table-header-operate"
                    type="primary" 
                    :disabled="editDisabled"
                    :size="size">
                    <div class="icon-button">
                        <Pencil v-if="!noIcon" />
                        <span class="table-header-operate-text">{{ boxTable.I18n('edit') }}</span>
                    </div>

                </el-button>
            </el-tooltip>

            <el-popconfirm 
                v-if="props.buttons.includes('delete') && boxTable.auth('del')" 
                @confirm="onClickDelete"
                :confirm-button-text="boxTable.I18n('delete')" 
                :cancel-button-text="boxTable.I18n('Cancel')"
                :title="boxTable.I18n('Are you sure to delete the selected record?')"
                :disabled="!enableBatchOpt"
                confirmButtonType="danger" >
                <template #reference>
                    <div class="mlr-12">
                        <el-tooltip 
                            :content="boxTable.I18n('Delete selected row')" 
                            placement="top">
                            <el-button v-blur 
                                :disabled="!enableBatchOpt" 
                                class="table-header-operate" 
                                type="danger"
                                :size="size">
                                <div class="icon-button">
                                    <Trashcan v-if="!noIcon" />
                                    <span class="table-header-operate-text">{{ boxTable.I18n('delete') }}</span>
                                </div>
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-popconfirm>

            <el-tooltip 
                placement="top" 
                v-if="props.buttons.includes('export') && boxTable.auth('export')" 
                :content="boxTable.I18n('Edit selected row')" 
                :disabled="npTooltip">
                <el-button v-blur 
                    @click="onClickExport" 
                    class="table-header-operate export" 
                    type="warning"
                    :size="size" 
                    :disabled="exportDisabeeld">
                    <div class="icon-button">
                        <file-lines v-if="!noIcon" />
                        <span class="table-header-operate-text">{{ boxTable.I18n('export') }}</span>
                    </div>
                </el-button>
            </el-tooltip>

            <!-- slot -->
            <slot></slot>

            <!-- 右侧搜索框和工具按钮 -->
            <div class="table-search">
                <el-input 
                    v-if="props.buttons.includes('quickSearch')" 
                    v-model="state.quickSearch"
                    class="xs-hidden quick-search" 
                    @input="debounce(onSearchInput, 500)()"
                    :placeholder="quickSearchPlaceholder ? quickSearchPlaceholder : boxTable.I18n('search')" />

                <div class="table-search-button-group"
                    v-if="props.buttons.includes('columnDisplay') || props.buttons.includes('comSearch')">

                    <el-dropdown 
                        v-if="props.buttons.includes('columnDisplay')" 
                        :max-height="380" :hide-on-click="false">
                        <el-button class="table-search-button-item"
                            :class="props.buttons.includes('comSearch') ? 'right-border' : ''" 
                            color="#dcdfe6" 
                            :size="size"
                            plain>
                            <Icon size="14" name="el-icon-s-grid" color="#000000" v-if="!noIcon" />
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="(item, idx) in columnDisplay" :key="idx">
                                    <el-checkbox v-if="item.prop" @change="onChangeShowColumn($event, item.prop)"
                                        :checked="item.show" :model-value="item.show" size="small" :label="item.label" />
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>

                    <el-tooltip 
                        v-if="props.buttons.includes('comSearch')"
                        :disabled="boxTable.table.showComSearch && npTooltip"
                        :content="boxTable.I18n('Expand generic search')" 
                        placement="top">
                        <el-button class="table-search-button-item"
                            @click="boxTable.table.showComSearch = !boxTable.table.showComSearch" color="#dcdfe6" plain
                            :size="size">
                            <Icon size="14" name="el-icon-search" color="#000000"/>
                        </el-button>
                    </el-tooltip>

                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { reactive, computed, inject } from 'vue'
import Icon from "../components/icon.vue"
import { debounce } from '../utils/common'
import { boxTableControl, provideName } from '../utils/boxTable'
import ComSearch from '@/components/table/comSearch/index.vue'

import Refresh from "../components/svg/refresh.vue"
import Plus from "../components/svg/plus.vue"
import Pencil from "../components/svg/pencil.vue"
import Trashcan from "../components/svg/trashcan.vue"
import FileLines from "../components/svg/filelines.vue"
import Vue from "vue"

interface Props {
    size?: string,
    npTooltip?: boolean,
    buttons: HeaderOptButton[]
    quickSearchPlaceholder?: string,
    boxTable?: boxTableControl,
    noIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    size: (Vue.prototype.$ELEMENT || {}).size || "",
    npTooltip: false,
    buttons: () => {
        return ['refresh', 'add', 'edit', 'delete']
    },
    noIcon: false,
    quickSearchPlaceholder: '',
})

const boxTable = (props.boxTable || inject(provideName))  as  boxTableControl;


const state = reactive({
    quickSearch: '',
})

const columnDisplay = computed(() => {
    let columnDisplayArr = []
    for (let item of boxTable.table.column) {
        item.type === 'selection' || item.render === 'buttons' || item.enableColumnDisplayControl === false ? '' : columnDisplayArr.push(item)
    }

    return columnDisplayArr
})

const enableBatchOpt = computed(() => (boxTable.table.selection.length > 0 ? true : false));

const addDisabled = computed(()=>{
    return boxTable.form.isAdd;
})


const editDisabled = computed(()=>{
    return !boxTable.table.selectRow
})

const exportDisabeeld = computed(()=>{
    return !boxTable.table.data.length;
})



const emits = defineEmits<{
    (e: 'action', event: string, data: anyObj): void
}>()

const changeUnfold = () => {
    emits('action', 'unfold', { unfold: !boxTable.table.expandAll })
}

const onSearchInput = () => {
    emits('action', 'quick-search', { keyword: state.quickSearch })
}

/** 切换某一个字段是否显示 */
function onChangeShowColumn(value: boolean, field?: string){

    const findColumn = boxTable.table.column.find((elem) => elem.prop == field);
    if(findColumn){
        findColumn.show = value;
    }
}


/** 刷新数据 */
function onClickRefresh(){
    boxTable.Refresh();
}


/** 添加数据 */
function onClickAdd() {
    boxTable.Add();
}

/** 编辑数据 */
function onClickEdit() {
    boxTable.Edit(boxTable.table.selectRow);
}


/** 点击导出 */
function onClickExport() {
    boxTable.Export();
}

/** 点击删除 */
function onClickDelete() {
    boxTable.Delete(boxTable.table.selection);
}

</script>

<style  lang="scss">
$el-color-info-light-7: #dedfe0;
$el-border-color: #dcdfe6;
$el-border-radius-base: 4px;
$el-color-info-dark-2: #73767a;

$ba-bg-color-overlay: inherit;
$el-button-disabled-text-color: rgba(255, 255, 255, 0.5);

.bx-table-header {


    .table-header {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 100%;
        background-color: $ba-bg-color-overlay;



        border-bottom: none;
        padding: 10px 0;
        font-size: 14px;

        .icon-button{
            svg{
                margin-right: 6px;
            }
        }

        .table-header-operate {
            &.export {
                margin-left: 10px;
            }

            .icon {
                font-size: 14px !important;
            }


            &.refresh .icon-button {
                svg {
                    margin-right: 0;
                }
            }
        }

        .el-button.is-disabled {
            .icon {
                color: $el-button-disabled-text-color !important;
            }
        }
    }

    .mlr-12 {
        margin-left: 12px;
    }

    .mlr-12+.el-button {
        margin-left: 12px;
    }

    .table-search {
        display: flex;
        margin-left: auto;
        align-items: center;

        .quick-search {
            width: auto;
        }
    }

    .table-search-button-group {
        display: flex;
        margin-left: 12px;
        border: 1px solid $el-border-color;
        border-radius: $el-border-radius-base;
        overflow: hidden;

        button:focus,
        button:active {
            background-color: $ba-bg-color-overlay
        }

        button:hover {
            background-color: $el-color-info-light-7;
        }

        .table-search-button-item {
            border: none;
            border-radius: 0;
        }

        .el-button+.el-button {
            margin: 0;
        }

        .right-border {
            border-right: 1px solid $el-border-color;
        }
    }

    html.dark {
        .table-search-button-group {

            button:focus,
            button:active {
                background-color: $el-color-info-dark-2;
            }

            button:hover {
                background-color: $el-color-info-light-7;
            }

            button {
                background-color: #898a8d;

                el-icon {
                    color: white !important;
                }
            }
        }
    }

    @import "../style/icon-button.scss";


}
</style>
