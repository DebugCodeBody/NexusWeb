/** 表格渲染类型 */
enum TableRenderType {
    /** 图标 */
    ICON = 'icon',
    /** 开关 */
    SWITCH = 'switch',
    /** 图片 */
    IMAGE = 'image',
    /** 图片组 */
    IMAGES = 'images',
    /** 标签 */
    TAG = 'tag',
    /** 标签组 */
    TAGS = 'tags',
    /** 链接 */
    URL = 'url',
    /** 时间 */
    DATETIME = 'datetime',
    /** 自定义模板 */
    CUSTOMTEMPLATE = 'customTemplate',
    /**  自定义组件/函数渲染 */
    CUSTOMRENDER = 'customRender',
    /** 按钮组 */
    BUTTONS = 'buttons'
}

window.TableRenderType = TableRenderType;



export {
    TableRenderType
}

