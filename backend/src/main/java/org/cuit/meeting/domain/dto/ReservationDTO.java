package org.cuit.meeting.domain.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;

@Data
public class ReservationDTO {
    /**
     * 主键id
     */
    private Integer id;

    /**
     * 会议主题
     */
    private String topic;

    /**
     * 会议描述
     */
    private String description;

    /**
     * 预约用户id
     */
    private Integer bookerId;

    /**
     * 会议室id
     */
    private Integer roomId;

    /**
     * 起始时间
     */
    private Date startTime;

    /**
     * 结束时间
     */
    private Date endTime;

    /**
     * 预约状态（待审核/已通过/已拒绝）
     */
    private String status;

    /**
     * 预约日期
     */
    private Date reserveDate;
}
