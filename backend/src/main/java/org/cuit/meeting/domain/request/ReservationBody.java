package org.cuit.meeting.domain.request;

import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;

    /**
     * 结束时间
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    /**
     * 预约日期
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date reserveDate;
}
