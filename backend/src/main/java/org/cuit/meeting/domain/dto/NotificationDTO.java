package org.cuit.meeting.domain.dto;

import lombok.Data;

@Data
public class NotificationDTO {
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
}
