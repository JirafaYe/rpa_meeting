package org.cuit.meeting.domain.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.cuit.meeting.domain.PageQuery;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
public class ReservationPageQuery extends PageQuery {
    /**
     * 起始时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;

    /**
     * 结束时间
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    /**
     * 预约日期
     */
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date reserveDate;
}
