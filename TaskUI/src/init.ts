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


export default initStatus
