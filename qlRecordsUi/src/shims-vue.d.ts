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



/** 规格类型 */
interface specType {
  w: string,
  h: string,
  l: string
}



interface orderResult {
  /** 工单号 */
  orderid: string,
  /** 登记结果 */
  status: number,
  /** 错误代码 */
  errmsg: string,
  /** 规格 */
  spec: specType | undefined,
  /** 提交返回的规格 */
  setSpec: string,

  /** 类型 */
  type: number
}


