package org.cuit.meeting.domain.request;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.cuit.meeting.domain.PageQuery;

@EqualsAndHashCode(callSuper = true)
@Data
public class UserPageQuery extends PageQuery {
    /**
     * 用户名
     */
    String userName;
}
