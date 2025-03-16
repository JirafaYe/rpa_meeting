package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.UserRole;

/**
* @author 18425
* @description 针对表【user_role(用户角色关联表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:02
* @Entity generator.domain.UserRole
*/
public interface UserRoleMapper extends BaseMapper<UserRole> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(UserRole record);

    UserRole selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(UserRole record);

    int updateByPrimaryKey(UserRole record);

}
