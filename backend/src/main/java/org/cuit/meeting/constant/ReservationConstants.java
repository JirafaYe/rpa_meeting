package org.cuit.meeting.constant;

public class ReservationConstants {
    /** 待审批状态 */
    public static final int NORMAL = 0;

    /** 通过状态 */
    public static final int ALLOW = 1;

    /** 拒绝状态 */
    public static final int REFUSED = 2;

    /** 待审批状态 */
    public static final String RESP_NORMAL = "待审核";

    /** 通过状态 */
    public static final String RESP_ALLOW = "已通过";

    /** 拒绝状态 */
    public static final String RESP_REFUSED = "拒绝";

    /** 普通字符串长度 */
    public static final int NORMAL_LENGTH=200;

    /** 会议标题长度 */
    public static final int topic_LENGTH=5;
}
