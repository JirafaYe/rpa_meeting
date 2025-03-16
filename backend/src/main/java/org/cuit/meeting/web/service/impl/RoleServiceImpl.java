package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.cuit.meeting.dao.RoleMapper;
import org.cuit.meeting.domain.entity.Role;
import org.cuit.meeting.web.service.RoleService;
import org.springframework.stereotype.Service;

/**
* @author 18425
* @description 针对表【role(角色表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role>
    implements RoleService {

}




