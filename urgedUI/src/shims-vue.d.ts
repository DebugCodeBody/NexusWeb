
/* eslint-disable */
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
}

declare interface StringConstructor {
  /**
 * 空字符串
 */
  Empty: string
}





declare const dd: otherApi;
declare const urlSearch: ParsedQuery = window.urlSearch;
declare let initCode: initStatus = window.initCode;
declare let initStatus: initStatus = window.initStatus;



/**
 * 部门类型
 */
interface branch {
  /**
   * 父部门
   */
  parent?: branch

  /**
   * 部门名字
   */
  deptname: string
  /**
   * 部门负责人
   */
  incharge: string[]
  /**
   * 部门id
   */
  idx: number

  /**
   * 子部门
   */
  children?: branchs
}

type branchs = Array<branch>


/**
 * 远程搜索订单结果
 */
interface remoteSearch {

  orderid: string
  moid: number
  attaid: number

}

type remoteSearchs = Array<remoteSearch>

interface orderDetailed {

  moid: string
  orderid: string
  filename: string[]

}

/**
 * 工单详细
 */
interface task {
  expid: number;
  createdate: string;
  createuser: string;
  barcode: string;
  orderid: string;
  moid: Moid;
  deptname: string;
  memo: string;
  stage: number;
}

type tasks = Array<task>;


enum perType {
  DEMAND = "demand",
  TASK = "task"
}

/**
 * 获取工单返回值
 */
type PreData = {
  all: tasks,
  demand: tasks,
  task: tasks,

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




// import {
//   branch,
//   branchs
// } from './module/branchType'
