package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.entity.MeetingNotification;

/**
* @author 18425
* @description 针对表【meeting_notification(会议相关通知表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:01
* @Entity generator.domain.MeetingNotification
*/
public interface MeetingNotificationMapper extends BaseMapper<MeetingNotification> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(MeetingNotification record);

    MeetingNotification selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(MeetingNotification record);

    int updateByPrimaryKey(MeetingNotification record);

}
