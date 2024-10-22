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



interface TaskCard {
  createdate: string,
  createuser: string,
  taskid: number,
  stageid: number,
  title: string,
  idx: Idx,
  orders: string,
  priority: number,
  urgent:boolean,
  endof:string

}

type TaskCards = Array<TaskCard>;


/**
 * 部门数据
 */
interface singItem {
  /**
   * 部门名字
   */
  name: string,
  /**
   * 部门标识
   */
  id: number,
  /**
   * 部门任务
   */
  data: TaskCards,

  /**
   * 移动到这里是否需要弹窗留言
   */
  ncomment:boolean
}

type singItems = Array<singItem>;




interface step {
  /**
   * 任务ID
   */
  taskid: number
  /**
   * 创建时间
   */
  createdate: string
  /**
   * 创建用户
   */
  createuser: string
  /**
   * 操作步骤
   */
  stageid: number
  /**
   * 留言消息
   */
  memo: string
}

type steps = Array<step>



type diaCloseCb = function(): void;

/**
 * 任务移动提交类型
 */
interface moveDra {
  /**
   * 列ID
   */
  stageid: number,
  /**
   * 任务ID
   */
  taskid: number,
  /**
   * 顺序ID 
   */
  idx: number

}
