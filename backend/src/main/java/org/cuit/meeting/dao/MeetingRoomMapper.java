package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.MeetingRoom;

/**
* @author 18425
* @description 针对表【meeting_room(会议室基础信息表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:01
* @Entity generator.domain.MeetingRoom
*/
public interface MeetingRoomMapper extends BaseMapper<MeetingRoom> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(MeetingRoom record);

    MeetingRoom selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(MeetingRoom record);

    int updateByPrimaryKey(MeetingRoom record);

}
