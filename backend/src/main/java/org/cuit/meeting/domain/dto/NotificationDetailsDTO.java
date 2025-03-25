package org.cuit.meeting.domain.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;

@Data
public class NotificationDetailsDTO {
    /**
     * 主键id
     */
    private Integer id;

    /**
     * 通知类型(1:预定成功 2:变更通知 3:取消通知 4:会前提醒)
     */
    private Integer notifyType;

    /**
     * 通知标题
     */
    private String title;

    /**
     * 通知内容
     */
    private String content;

    /**
     * 发送人(系统用户填0)
     */
    private Integer senderId;

    /**
     *
     */
    private Date createTime;
}
