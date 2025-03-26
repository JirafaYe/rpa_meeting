package org.cuit.meeting.domain.request;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ReservationBody {
    /**
     * 会议主题
     */
    private String topic;

    /**
     * 参会人员
     */
    private List<Integer> participants;

    /**
     * 会议描述
     */
    private String description;

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
     * 预约日期
     */
    private Date reserveDate;
}
