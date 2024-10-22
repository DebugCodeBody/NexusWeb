declare const dd: any;

declare interface Window {
    [key: string]: any
}



declare interface userInfo {
    // 用户名字
    name: string
    // 钉钉ID
    userid: string
    // 员工id
    empid?: string
    // 钉钉头像
    avatar: string
    // 员工部门
    branch: string

}
