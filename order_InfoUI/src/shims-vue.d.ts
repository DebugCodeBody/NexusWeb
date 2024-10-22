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
  onBeiliaoLog: any
  selectBeianItem: any
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


interface Proces {
  /** 工艺开始时间 */
  seq: string,

  /** 工艺名字 */
  name: string,

  /** 工艺状态 */
  state: string,

  /** 完工时间 */
  time: string,

  /** 当前工艺需要的时间 */
  hours: string,
}

type Process = Array<Proces>;

interface workInfo {
  curr_name1: string,
  curr_hour: string,
  curr_name: string,
  fcurr_plan_start: string,

  /** 工单详细图片 */
  filename: Array<string>

  /** 销售单号 */
  forder_name: string,

  /** 出货日期 */
  fdelivery_date_line: string,

  /** 计划延期 */
  fplan_delay_date: string,

  /** 延期次数 */
  fcard_id: number,

  /** 生厂完工日期 */
  fdeliver_date: string,

  /** 尾款 */
  fbalance: string,

  /** 客户名 */
  partner_name: string,

  /** 交期不可推 */
  fundelayed: boolean,

  /** 加急费 */
  furgent_cost: string,

  /** 重点跟进 */
  allow_reorder: boolean,

  /** 自动报价 */
  fcall_cs: boolean,

  /** 客户催货 */
  ffollow: boolean,

  /** 产品名称 */
  name_template: string,

  /** 数量 */
  product_qty: string,

  /** 材质 */
  fmaterial_man: string,

  /** 规格 */
  flength_man: string,

  /** 备注 */
  fshipping_date: string,

  /** 备料位置 */
  dstname: string,

  /** 关联文件数组 */
  samedoc: Array<string>,

  /** 工艺 */
  proces: Process,


}




/**
 * 任务流程
 */
 type step = {
  /**
   * 创建时间
   */
  createdate: string
  /**
   * 详细描述
   */
  memo: string
  /**
   * 任务步骤
   */
  stage: number
  /**
   * 操作人员
   */
  username: string
}

type steps = Array<step>
