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

  toPath: (str: string) => void
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



enum initStatus {
  /**
   * 环境初始化失败，根据当前应用进行初始化
   */
  NOENVIRONMENT,

  /**
   * 登录失败
   */
  NOLOGIN,

  /**
   * 成功
   */
  SUCCESS
}


interface Food {

  /**
   * 菜品的唯一标识
   */
  id: number,

  /**
   * 菜品的名字
   */
  name: string,

  /**
   * 菜品的价格
   */
  pic: number,

  /**
   * 时间
   */
  time: [number, number, number, number]

  /**
   * 份量
   */
  weight?: Array<string>,

  /**
   * 口味
   */
  taste?: Array<string>,

  /**
   * 库存数量
   */
  stock: number,

  /**
   * 选中的份量索引
   */
  selectWeight: number,

  /**
   * 选中的口味索引
   */
  selectTaste: number,

  /**
   * 选中的属性
   */
  arttText: Array<string>,

  /**
   * 这个菜购物车里的总和
   */
  number: number,

  

  /**
   * 每个时间段选的数量
   * watch专用了
   */
  dictionary: [number, number, number, number]




}

type Foods = Array<Food>;


interface test extends Food {

  /**
   * 数量
   */
  num: number,
  /**
   * 是否打包
   */
  pack: boolean

}

/**
 * 时间
 */
interface storeDate {
  /**
   * 带上年份的日期 ****-**-**
   */
  date: string,

  /**
   * 日期 **-**
   */
  str: string,

  /**
   * 
   */
  weekday: string,

  /**
   * 上次选中的时间段，在切换时间的时候保存用的
   */
  keepTime: number,

  /**
   * 是否结束了
   */
  end: boolean
}

type storeDates = Array<storeDate>;


interface orderItem {
  /**
   * 菜品唯一ID
   */
  token: number,
  /**
   * 菜品名字
   */
  name: string,
  /**
   * 菜品数量
   */
  weight: number,
  /**
   * 菜品口味
   */
  taste: propItem,
  /**
   * 是否打包
   */
  pack: boolean,

  /**
   * 菜品规格ID，提交的时候要用到
   */
  id: number,

  /** 是否为缓存 */
  iscache?:boolean
}

type orderItems = Array<orderItem>;


/**
 * 菜品属性
 */
interface propItem {
  /**
   * 属性的id
   */
  fid: number,
  /**
   * 属性的价格
   */
  price: number,
  /**
   * 属性的名字
   */
  prop: string,

  parent: foodItem
}
type propItems = Array<propItem>;

/**
 * 菜
 */
interface foodItem {

  /**
   * 是否有偏好选中
   */
  id?: number,

  /**
   * 菜名
   */
  name: string,

  /**
   * 仓库数量
   */
  qty: number,

  /**
   * 属性列表
   */
  prop: propItems,

  /**
   * 菜品类型
   */
  type: string,

  /**
   * 这个菜购物车上所有规格的总数量
   */
  num: number,

  /** 克数 */
  raw: string[]

  /**
   * 唯一标识
   */
  token: number



}
type foodItems = Array<foodItem>

/**
 * 类型
 */
interface typeItem {
  /**
   * 类别名字
   */
  name: string,
  /**
   * 菜品列表
   */
  data: foodItems
}

type typeItems = Array<typeItem>;



type foodData = Array<typeItems>;








