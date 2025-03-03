<script lang="ts">

// @ts-nocheck



import { version } from "vue"


import { fullUrl, arrayFullUrl } from '../utils/common'
import { timeFormat, getPropByPath } from '../utils/index'
import { boxTableControl, provideName } from '../utils/boxTable'

import Icon from "../components/icon.vue"
import buttons from "./widgets/buttons.vue"
import Switch from "./widgets/switch.vue"
import datetime from "./widgets/datetime.vue"
import image from "./widgets/image.vue"
import images from "./widgets/images.vue"
import tag from "./widgets/tag.vue"
import tags from "./widgets/tags.vue"
import url from "./widgets/url.vue"

const elMap = {
    icon: Icon,
    switch: Switch,
    datetime,
    image,
    images,
    tag,
    tags,
    url,
    buttons
}

interface Props {
    row: TableRow
    field: TableColumn
    // 字段名
    property?: string,
    customRender?: any
}

const isVue2 = version.substring(0, 1) == '2';


export default {
    inheritAttrs: false,
    props: ["row", "field", "property", "customRender"],
    setup(props: Props) {

        const { field, property = "" } = props;
        const renderStr = field.render as keyof (typeof elMap);

        const fieldValue = computed(() => {
            return getPropByPath(props.row, property, false).v;
        });

        return () => {
            const el = elMap[renderStr];

            let children: any;
            if (props.customRender) {

                children = props.customRender({
                    renderRow: props.row,
                    renderField: props.field,
                    renderValue: fieldValue.value,
                    property
                })

            } else {


                if (isVue2) {
                    children = h(el, {
                        attrs: {
                            renderRow: props.row,
                            renderField: props.field,
                            renderValue: fieldValue.value,
                            property
                        }
                    })


                } else {
                    children = h(el, {
                        renderRow: props.row,
                        renderField: props.field,
                        renderValue: fieldValue.value,
                        property
                    })
                }




            };

            return h("div", {
                class: "table-field-render"
            }, [children])
        }
    }


}





</script>

<style lang="scss">
.table-field-render {

    .m-10 {
        margin: 4px;
    }

    .box-render-image {
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


    .box-cell-render-url {
        a {
            color: #0000EE;
        }

    }

    .box-cell-buttons {
        display: flex;
        justify-content: center;
        align-items: center
    }

}
</style>
