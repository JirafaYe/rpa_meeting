package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.constant.NotificationConstants;
import org.cuit.meeting.dao.MeetingNotificationMapper;
import org.cuit.meeting.domain.entity.MeetingNotification;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.web.service.MeetingNotificationService;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
* @author 18425
* @description 针对表【meeting_notification(会议相关通知表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class MeetingNotificationServiceImpl extends ServiceImpl<MeetingNotificationMapper, MeetingNotification>
    implements MeetingNotificationService {

    @Override
    public boolean notifyApprove(Reservation reservation, boolean isAllowed) {
        MeetingNotification notification = new MeetingNotification();
        notification.setReservationId(reservation.getId());
        //非定时通知直接写已发送状态
        notification.setStatus(NotificationConstants.SENDING_SUCCESS);
        if(isAllowed){
            notification.setNotifyType(NotificationConstants.SUCCESS);
            notification.setTitle(NotificationConstants.SUCCESS_RESERVATION);
        }else {
            notification.setNotifyType(NotificationConstants.CANCELED);
            notification.setTitle(NotificationConstants.FAILED_RESERVATION);
        }
        notification.setContent(String.format(notification.getTitle()+"会议:%s\n会议时间%s"
                ,reservation.getTopic(),NotificationConstants.formatter.format(reservation.getStartTime()))
        );
        notification.setSenderId(reservation.getBookerId());
        notification.setCreateTime(new Date());

        return save(notification);
    }
}




