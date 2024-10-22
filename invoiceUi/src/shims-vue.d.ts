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



type invoiceInfo = {
  /** 
   * 发票类型
   * 0 = 不开票
   * 1 = 普票
   * 2 = 增值票
   * */
  "type": number,
  /** 客户id */
  "custid": number,
  /** 订单号 */
  "soname": string,
  /** 金额 */
  "amount": string,
  /** 发票类型字符串 */
  "finv_type": string,
  /** 抬头名称 */
  "fcompanyname": string,
  /** 单位税号 */
  "ftaxnumber": string,
  /** 注册地址 */
  "fcompanyaddr": string,
  /** 注册电话 */
  "ftelephone": string,
  /** 开户银行 */
  "fbankofdeposit": string,
  /** 银行帐号 */
  "faccountnumber": string,
  /** 是否已经开票 */
  "apply": boolean
} & {
  [key: string]: string
}



type pdfItem = {
  /** 附件ID */
  solid: number,
  /** 文件名 */
  name: string,
  
  /** 图片路径 */
  img: string,

  /** 新文件名 */
  new_file: string,

}

