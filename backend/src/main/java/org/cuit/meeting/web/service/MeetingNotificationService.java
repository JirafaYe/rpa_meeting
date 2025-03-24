package org.cuit.meeting.web.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cuit.meeting.domain.entity.MeetingNotification;
import org.cuit.meeting.domain.entity.Reservation;

/**
* @author 18425
* @description 针对表【meeting_notification(会议相关通知表)】的数据库操作Service
* @createDate 2025-03-16 21:56:32
*/
public interface MeetingNotificationService extends IService<MeetingNotification> {
    //审批通过or拒绝时通知
    boolean notifyApprove(Reservation reservation, boolean isAllowed);
    //一般通知，如：取消，会前提醒，变更
    boolean notify(Reservation reservation, int type);
}
