package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.entity.Participants;

/**
* @author 18425
* @description 针对表【participants(参会用户表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:02
* @Entity generator.domain.Participants
*/
public interface ParticipantsMapper extends BaseMapper<Participants> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(Participants record);

    Participants selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Participants record);

    int updateByPrimaryKey(Participants record);

}
