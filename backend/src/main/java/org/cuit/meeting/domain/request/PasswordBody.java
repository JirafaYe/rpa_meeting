package org.cuit.meeting.domain.request;

import lombok.Data;

/**
 * @author dingyangwei001
 * @description
 * @date 2025/03/30 17:46
 **/
@Data
public class PasswordBody {

    /**
     * 用户id
     */
    private Integer id;

    /**
     * 旧密码
     */
    private String oldPassword;

    /**
     * 新密码
     */
    private String newPassword;

    /**
     * 确认密码
     */
    private String confirmPassword;
}
