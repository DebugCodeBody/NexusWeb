

enum paskStateEnum {
    
    /**
     * 工单准备好了，正等待安排销售专员
     */
    OUT = 0,
    
    /**
     * 工单准备好了，正等待安排销售专员
     */
    PREPA = 1,

    /**
     * 有销售专用跟踪
     */
    TRACK,

    /**
     * 已经结案
     */
    CLOSE,

    /**
     * 留言消息
     */
    GUESTBOOK = 99

}

export default paskStateEnum
