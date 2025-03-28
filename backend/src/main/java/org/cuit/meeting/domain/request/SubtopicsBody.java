package org.cuit.meeting.domain.request;

import lombok.Data;

@Data
public class SubtopicsBody {
    /**
     * 预约id
     */
    private Integer reservationId;

    /**
     * 子主题
     */
    private String subtopics;

    /**
     * 子主题描述
     */
    private String description;
}
