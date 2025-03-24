package org.cuit.meeting.domain.request;

import lombok.Data;
import org.cuit.meeting.domain.PageQuery;

import java.util.Date;

@Data
public class ReservationPageQuery extends PageQuery {
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
