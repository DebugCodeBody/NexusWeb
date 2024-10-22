import SvgIcon from '@/components/SvgIcon/index.vue'// svg component



const req = require.context('./svg', false, /\.svg$/)
const requireAll = (requireContext: any) => {
    
    return requireContext.keys().map(requireContext);
}
requireAll(req)


export default function install(Vue: any) {
    Vue.component('svg-icon', SvgIcon)
}
