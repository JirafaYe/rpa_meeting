package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.entity.User;

/**
* @author 18425
* @description 针对表【user(用户基本信息表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:02
* @Entity generator.domain.User
*/
public interface UserMapper extends BaseMapper<User> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(User record);

    User selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);

}
