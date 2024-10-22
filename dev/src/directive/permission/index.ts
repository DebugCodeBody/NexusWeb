import { userStore } from "@/store";


const permission = {
    install(Vue: any) {
        Vue.directive('permission', permission)
    },
    mounted(el: HTMLElement, binding: any) {
        const { value } = binding

        const { roles } = userStore();
        if (value && value instanceof Array) {
            if (value.length > 0) {
                const permissionRoles = value
                const hasPermission = roles.some(role => {
                    return permissionRoles.includes(role)
                })
                if (!hasPermission) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            }
        } else {
            throw new Error(`使用方式： v-permission="['admin','editor']"`)
        }
    }

}




export default permission