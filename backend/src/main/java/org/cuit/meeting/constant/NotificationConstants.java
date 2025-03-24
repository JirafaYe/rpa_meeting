package org.cuit.meeting.constant;

import java.text.SimpleDateFormat;

public class NotificationConstants {
    //通知类型
    //预约成功
    public static final int SUCCESS=1;
    //更改会议
    public static final int MODIFICATION=2;
    //取消会议
    public static final int CANCELED=3;
    //会前通知
    public static final int NOTIFICATION=4;

    //系统通知用户
    public static int SYS_ADMIN=0;

    //预约成功标题
    public static final String SUCCESS_RESERVATION="会议预约成功";
    //预约失败标题
    public static final String FAILED_RESERVATION="会议预约失败";
    //会议取消标题
    public static final String CANCELED_RESERVATION="会议取消";

    //发送状态
    //已发送
    public static final int SENDING_SUCCESS =2;

    // 时间格式
    public static final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
}
