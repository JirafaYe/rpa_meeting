package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.dao.MeetingNotificationMapper;
import org.cuit.meeting.domain.entity.MeetingNotification;
import org.cuit.meeting.web.service.MeetingNotificationService;
import org.springframework.stereotype.Service;

/**
* @author 18425
* @description 针对表【meeting_notification(会议相关通知表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class MeetingNotificationServiceImpl extends ServiceImpl<MeetingNotificationMapper, MeetingNotification>
    implements MeetingNotificationService {

}




