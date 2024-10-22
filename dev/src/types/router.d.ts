type routerMeta = import('vue-router').RouteMeta & {
    /** 图标名字啊 */
    icon?: string,
    /** 是否不在keep上面缓存路由 */
    noCache: boolean,
    /** 路由名字，用来显示在tags上面 */
    title: string,
    /** 是否顶住，意思就是说是都在tags上面一直显示不可以被删除 */
    affix?: boolean,
}

type routerItem = import('vue-router').RouteConfig & {
    /** 是否总是显示，与 hidden 互斥 */
    alwaysShow?: boolean,
    /** 是否隐藏 */
    hidden?: boolean,
    /** 是否没有子菜单 */
    noShowingChildren?: boolean,
}

type routerItems = routerItem[];

/** 路由标签 */
type routerTag = {
    /** 完整的路径 */
    fullPath: string,
    /** 路径 */
    path: string,
    /** 路由名字 */
    name: string,
    /** 标签的名字 */
    title: string,

    meta: routerMeta
}

type routerTags = routerTag[];



