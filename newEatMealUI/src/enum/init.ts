String.Empty = "";

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

window.MealTime = MealTime;

export default initStatus
