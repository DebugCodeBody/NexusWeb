import { createPinia, PiniaVuePlugin } from 'pinia'


const pinia = createPinia();


export default pinia;



export { default as sidebarStore } from './modules/sidebar'
export { default as tagsviewStore } from './modules/tagsView'
export { default as permissionStore } from './modules/permission'
export { default as userStore } from './modules/user'


