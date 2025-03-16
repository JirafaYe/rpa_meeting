package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.dao.UserMapper;
import org.cuit.meeting.domain.entity.User;
import org.cuit.meeting.web.service.UserService;
import org.springframework.stereotype.Service;

/**
* @author 18425
* @description 针对表【user(用户基本信息表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService {

}




