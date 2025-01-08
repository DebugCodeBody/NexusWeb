/* eslint-disable */
/// <reference types="vue/macros-global" />
/// <reference types="../declare/auto-imports" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}





interface PromiseConstructor {
  readonly prototype: Promise<any>;

  new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

  all<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;

  race<T extends readonly unknown[] | []>(values: T): Promise<Awaited<T[number]>>;

  reject<T = never>(reason?: any): Promise<T>;

  resolve(): Promise<void>;

  resolve<T>(value: T | PromiseLike<T>): Promise<T>;
}

interface userInfo {
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



declare interface Window {
  urlSearch: ParsedQuery
  dd: otherApi

  initStatus: initStatus
  initCode: initStatus

  [key: string | Symbol]: any
}

declare interface StringConstructor {
  /**
 * 这是C#里面的一个属性，挺好用的就拿过来代表空字符串
 */
  Empty: string
}


declare const dd: otherApi;
declare const urlSearch: ParsedQuery = window.urlSearch;
declare let initCode: initStatus = window.initCode;
declare let initStatus: initStatus = window.initStatus;



/**
 * 钉钉二维码扫描结果
 */
interface scanResult {
  text: string
};

/**
 * 钉钉二维码扫描错误
 */
interface scanError {
  code: number
};



type mettItem = {
  id: number,
  title: string,
  create_user: string,
  is_urgent: string,
  tissue_user: string,
  /** 跟进人员 */
  track_user: string,
  create_date: string,
  content: string,
  start_time: string,
  type: string,
  status: number,
  is_start: boolean,
  not_neceuser: string[],
  actor_user: string[],
  is_resource: boolean,
  rtime: string,
  log: {
    createdate: string,
    fname: string,
    memo: string,
    img: string[]
  }[],
  
  is_mark: boolean,

  img: string[],

  /** 会议结果 */
  result: string,
  /** 沟通人 */
  comm_user: string,

  /** 标签内容 */
  tag_content: string,

  /** 是否关注内容 */
  follow: boolean,

  /** 创建的群号 */
  create_group: string,

  /** 下一次任务的时间 */
  next_time: string,

  /** 期待响应时间 */
  expect: {
    time: string,
    banci: string
  },

  /** 工艺优化 */
  is_optimize: boolean,

  /** 扩展字段 */
  extend_type: string

};

type mettItems = mettItem[];

type userItem = {
  name: string,
  py: string,
  count: number
}

type actorGroup = {
  name:string,
  user: string[]
}


type resourceType = {
  label: string,
  day: number

}