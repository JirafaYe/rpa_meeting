package org.cuit.meeting.domain.request;

import lombok.Data;

/**
 * @author dingyangwei001
 * @description 描述
 * @date 2025/03/30 17:24
 **/
@Data
public class SummaryBody {

    /**
    * 会议id
    */
    private Integer reservationId;

    /**
    * 总结内容
    */
    private String summary;
}
