package org.cuit.meeting.domain.request;

import lombok.Data;

/**
 * @description 描述
 * @author dingyangwei001
 * @date 2025/03/30 17:35
 **/
@Data
public class UserBody {

    private Integer id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 头像地址
     */
    private String avatarUrl;

    /**
     * 账号状态（0启用/1禁用）
     */
    private Integer isActive;
}
