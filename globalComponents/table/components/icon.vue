<script lang="ts">
import { defineComponent, computed, h } from 'vue'

import svg from './tableSvg.vue'
import { isExternal } from "../utils"



export default defineComponent({
    name: 'Icon',
    props: {
        name: {
            type: String,
            required: true,
        },
        size: {
            type: String,
            default: '18px',
        },
        color: {
            type: String,
            default: '#FFFFFF',
        },
    },
    setup(props) {


        const iconStyle = computed((): any => {
            const { size, color } = props
            let s = `${size.replace('px', '')}px`
            return {
                fontSize: s,
                color: color,
            }
        })

        if (props.name.indexOf('el-icon-') === 0) {

            return () => h('i', {
                class: [props.name, 'icon'],
                style: iconStyle.value
            })

        } else if (props.name.indexOf('local-') === 0 || isExternal(props.name)) {

            return () => h(svg, {
                attrs: {
                    name: props.name,
                    size: props.size,
                    color: props.color
                }
            })

        } else {

            return () => h('i', {
                class: [props.name, 'icon'],
                style: iconStyle.value
            })

        }


    },
})
</script>
