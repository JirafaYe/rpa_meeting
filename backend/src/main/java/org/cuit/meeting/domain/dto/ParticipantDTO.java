package org.cuit.meeting.domain.dto;

import lombok.Data;

@Data
public class ParticipantDTO {

    /**
     * 用户名
     */
    private String username;

    /**
     * 头像地址
     */
    private String avatarUrl;

    /**
     * 状态(0:待处理 1:已接受 2:已拒绝)
     */
    private Integer status;
}
