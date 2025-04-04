package org.cuit.meeting.web.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.User;
import org.cuit.meeting.domain.request.PasswordBody;
import org.cuit.meeting.domain.request.RegisterBody;
import org.cuit.meeting.domain.request.UserBody;
import org.cuit.meeting.domain.request.UserPageQuery;


/**
* @author 18425
* @description 针对表【user(用户基本信息表)】的数据库操作Service
* @createDate 2025-03-16 21:56:32
*/
public interface UserService extends IService<User> {

    String register(RegisterBody registerBody);

    String login(String username, String password, String code, String uuid);

    Result<Object> updatePassword(PasswordBody body);

    PageDTO<UserBody> pageUsers(UserPageQuery query);
}
