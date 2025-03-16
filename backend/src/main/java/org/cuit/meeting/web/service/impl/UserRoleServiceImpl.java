package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.dao.UserRoleMapper;
import org.cuit.meeting.domain.entity.UserRole;
import org.cuit.meeting.web.service.UserRoleService;
import org.springframework.stereotype.Service;

/**
* @author 18425
* @description 针对表【user_role(用户角色关联表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class UserRoleServiceImpl extends ServiceImpl<UserRoleMapper, UserRole>
    implements UserRoleService {

}




