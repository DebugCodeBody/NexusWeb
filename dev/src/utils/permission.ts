import { userStore } from "@/store"


/**
 * 函数式权限认证
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value: string[]) {
    if (value && value instanceof Array && value.length > 0) {
        const { roles } = userStore();
        const permissionRoles = value

        const hasPermission = roles.some(role => {
            return permissionRoles.includes(role)
        })
        return hasPermission
    } else {
        console.error(`使用方式：checkPermission="['admin','editor']"`)
        return false
    }
}
