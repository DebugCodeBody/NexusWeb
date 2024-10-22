<script  lang="ts">


import SvgIcon from '@/components/SvgIcon/index.vue'// svg component


import { h } from 'vue'



export default defineComponent({
    name: 'MenuItem',
    props: {
        icon: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        }
    },
    render() {
        const vnodes = [];

        if (this.$props.icon) {
            vnodes.push(h(SvgIcon, {
                "icon-class": this.$props.icon
            }))
        }

        if (this.$props.title) {
            vnodes.push(h("span", {}, [this.$props.title]))
        }


        return vnodes;


    },

})
</script>