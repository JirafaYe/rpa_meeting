package org.cuit.meeting.domain.request;


import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class SubtopicsUpdateBody extends SubtopicsBody{
    /**
     * 主键id
     */
    private Integer id;
}
