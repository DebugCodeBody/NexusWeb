import Layout from "@/layout/index.vue"
import dataRoutre from "./data"


/**
 *  这写路由是一个固定住的了
 *  因为一个后台管理，需要一些常用的页面
 *  就比如登录页面，登录成功的进去首页
 * 
 * 
 * meta
 *  name -- 这个名字一定要和组件的name一致，不然的话会导致缓存失败 
 *  
 *  
 * 
 * 
 */
const constantRouterMap: routerItems = [

    {
        path: '/login',
        meta: { title: '登录', noCache: true },
        component: () => import('@/views/login/index.vue'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/features/404.vue'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/features/401.vue'),
        hidden: true
    },
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: () => import('@/views/features/redirect.vue')
            }
        ]
    },
    {
        path: '/',
        component: Layout,
        redirect: "/index",
        children: [
            {
                path: "/index",
                component: () => import('@/views/main/index.vue'),
                name: 'Dashboard',
                meta: { title: "首页", icon: 'index', affix: true, noCache: true }
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'center',
                component: () => import('@/views/system/user/center/index.vue'),
                name: '个人中心',
                meta: { title: '个人中心' }
            }
        ]
    }

]



/** 从远程获取菜单，然后生成vue-router能够识别的格式 */
export const loadMenus = function () {

    return new Promise<routerItems>((resolve, reject) => {

        const asyncRouter = filterAsyncRouter(dataRoutre);
        asyncRouter.push({ path: "/:pathMatch(.*)", redirect: '/404', hidden: true });
        resolve(asyncRouter)

    })

}

/** 遍历后台传来的路由字符串，转换为组件对象 */
export const filterAsyncRouter = (routers: any) => {
    return routers.filter((router: any) => {
        if (router.component) {
            if (router.component === 'Layout') {
                // Layout组件就是右边显示的内容了，所以要把父路由给赋值上去。这样才能把子路由的内容显示到右边
                router.component = Layout
            } else {
                router.component = loadView(router.component as string)
            }
        }
        if (router.children && router.children.length) {
            router.children = filterAsyncRouter(router.children)
        }
        return true
    })
}



/**
 * 远程拉取页面函数
 * @param viewPath：页面的路径
 * @returns 
 */
export const loadView = (viewPath: string) => {
    return ()=> import(`@/views/${viewPath}`);
}



export default constantRouterMap;


