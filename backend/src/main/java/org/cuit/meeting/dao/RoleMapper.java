package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.cuit.meeting.domain.entity.Role;

/**
* @author 18425
* @description 针对表【role(角色表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:02
* @Entity generator.domain.Role
*/
@Mapper
public interface RoleMapper extends BaseMapper<Role> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(Role record);

    Role selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Role record);

    int updateByPrimaryKey(Role record);

}
