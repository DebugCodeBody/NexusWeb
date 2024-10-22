/* eslint-disable */
/// <reference types="vue/macros-global" />
/// <reference types="../declare/auto-imports" />
/// <reference types="dayjs" />



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


  [key: string | symbol]: any
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


interface Datum {
  /** 菜名 */
  name: string;
  /** 类型，跟父节点的type同名 */
  type: string;
  /** 材料表 */
  raw: string[];
  /** 既没有口味属性，也没有其他的份量和重要价格可选的时候用 */
  details: Details;

  /** 口味属性 */
  attributes: attribute[];

  /** 会影响价格的属性  */
  specFoods: SpecFood[];
}

/** 选项的id和价格 */
interface Details {
  /** 价格 */
  price: string,
  /** id */
  id: string
}

/** 口味属性 */
interface attribute {
  /** 标题名字 */
  name: string;
  details: AttributeDetail[]
}

/** 口味属性的选项 */
interface AttributeDetail {
  /** 选项名字 */
  name: string,
  /** 选项是否选中 */
  selected: boolean,
  /** 选项是否禁止 */
  disabled: boolean,
  /** 当前这个属性被选中的时候，名字后面是否增加此属性 */
  show: boolean
}


/**
 * 
 * 会影响价格的属性描述
 * 
 */
type SpecFoodDetail = Details & AttributeDetail


/** 
 * 会影响价格的属性，
 * 比如菜的份量,整份还是半份
 * 还有饭的重量 一两，二两，三两
 * */
interface SpecFood {
  /** 属性名字 */
  name: string;
  details: SpecFoodDetail[];
}


/** 代理一下菜单，用来展示一些内容 */
type reFood = Datum & {


  /** 这个菜购物车选中的所有数量之和 */
  cartNum: number,

  /** 需要显示的价格 */
  showPrice: string,

  /** 需要显示的名字 */
  showName: string,


  /** 最后选中属性的名称 */
  selectAttri: string,

  /** 最后一次选中的价格 */
  selectPrice: string

};


/**
 * 
 * 饭点枚举类
 * 
 */
enum MealTime {
  /** 早餐  */
  breakfast,
  /** 中餐 */
  lunch,
  /** 晚餐 */
  dinner,
  /** 夜宵 */
  supper
}

/** 一天的封装对象 */
interface Time {
  /** dayjs对象 */
  day: dayjs,
  /** 2012-10-1的时间字符串 */
  YMD: string,
  /** 02.21的时间字符串 */
  MD: string,
  /** 是否选中 */
  select: boolean,
  /** 是否禁止 */
  disabled: boolean,
  /** 周一的周几字符串 */
  week: string,
  /** 在右上角是否有个热点红标 */
  dot: boolean
}
type Times = Time[];


/** 购物车里的菜品 */
type foodCard = {
  /** 菜 */
  food: reFood,
  /** 是否打包 */
  pack: boolean,
  /** 菜的数量 */
  num: number,

  /** 是否已经提交过，这个用来缓存的时候用 */
  submit: boolean,
  /** 口味属性 */
  attributes: attribute[],
  /** 影响价格的属性 */
  specFoods: SpecFood[],

  /** 需要显示的价格 */
  price: string,

  /** 需要显示的名字 */
  name: string,

  /** 这个菜的时间段 */
  mealTime: MealTime

}

/**
 * 
 * 一天内的数组泛型
 * 购物车上
 * 菜单列表上 
 * 
 */
type dayArray<T> = [Array<T>, Array<T>, Array<T>, Array<T>]

/** 购物车里的一天选中商品 */
type dateFoodCard = dayArray<foodCard>;



type typeFood = dayArray<{
  /** 类型 */
  name: string,
  /** 菜品数组 */
  data: reFood[]
}>


/** 已经点过的记录 */
type historyFood = dayArray<{
  /** 菜名，包含属性 */
  name: string,
  /** 是否打包 */
  pack: boolean,
  /** 数量 */
  weight: number
}>


