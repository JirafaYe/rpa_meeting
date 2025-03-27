package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.constant.NotificationConstants;
import org.cuit.meeting.constant.ParticipantsConstants;
import org.cuit.meeting.dao.MeetingNotificationMapper;
import org.cuit.meeting.dao.UserMapper;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.NotificationDTO;
import org.cuit.meeting.domain.dto.NotificationDetailsDTO;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.MeetingNotification;
import org.cuit.meeting.domain.entity.Participants;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.web.service.MeetingNotificationService;
import org.cuit.meeting.web.service.ParticipantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
* @author 18425
* @description 针对表【meeting_notification(会议相关通知表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class MeetingNotificationServiceImpl extends ServiceImpl<MeetingNotificationMapper, MeetingNotification>
    implements MeetingNotificationService {

    @Autowired
    ParticipantsService participantsService;

    @Autowired
    UserMapper userMapper;

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
        //增加通知标题信息
        notification.setTitle(String.format("[%s]",notification.getTitle())+reservation.getTopic());
        notification.setContent(String.format(notification.getTitle()+":%s\n会议时间:%s"
                ,reservation.getTopic(),NotificationConstants.formatter.format(reservation.getStartTime()))
        );
        notification.setSenderId(reservation.getBookerId());
        notification.setCreateTime(new Date());

        return save(notification);
    }

    @Override
    public boolean notify(Reservation reservation, int type) {
        MeetingNotification notification = new MeetingNotification();
        notification.setReservationId(reservation.getId());
        //非定时通知直接写已发送状态
        notification.setStatus(NotificationConstants.SENDING_SUCCESS);

        //根据类型设置标题
        switch (type){
            case NotificationConstants.CANCELED:
                notification.setNotifyType(NotificationConstants.CANCELED);
                notification.setTitle(NotificationConstants.CANCELED_RESERVATION);
                break;
            case NotificationConstants.NOTIFICATION:
                notification.setNotifyType(NotificationConstants.NOTIFICATION);
                notification.setTitle(NotificationConstants.NOTIFICATION_RESERVATION);
                break;
            case NotificationConstants.MODIFICATION:
                notification.setNotifyType(NotificationConstants.MODIFICATION);
                notification.setTitle(NotificationConstants.MODIFY_RESERVATION);
                break;
        }

        //增加通知标题信息
        notification.setTitle(String.format("[%s]",notification.getTitle())+reservation.getTopic());

        notification.setContent(String.format(notification.getTitle()+":%s\n会议时间:%s"
                ,reservation.getTopic(),NotificationConstants.formatter.format(reservation.getStartTime()))
        );
        notification.setSenderId(NotificationConstants.SYS_ADMIN);
        notification.setCreateTime(new Date());

        return save(notification);
    }

    @Override
    public PageDTO<NotificationDTO> pageQuery(PageQuery query, int userId) {
        LambdaQueryWrapper<Participants> participants = new LambdaQueryWrapper<>();
        //查找个人参加的会议
        participants.eq(Participants::getUserId,userId).ne(Participants::getStatus, ParticipantsConstants.REFUSED);
        List<Integer> reservations = participantsService.list(participants)
                .stream().map(Participants::getReservationId).collect(Collectors.toList());
        //根据会议id查找通知
        LambdaQueryWrapper<MeetingNotification> wrapper = new LambdaQueryWrapper<>();
        //判断是否有参加的会议
        if(!reservations.isEmpty()) {
            wrapper.in(MeetingNotification::getReservationId, reservations);
        }
        Page<MeetingNotification> result = this.page(query.toMpPage(), wrapper);

        PageDTO<NotificationDTO> pageDTO = new PageDTO<>();
        pageDTO.setPages(result.getPages());
        pageDTO.setTotal(result.getTotal());
        if(!result.getRecords().isEmpty()){
            pageDTO.setList(result.getRecords().stream().map(this::convert).collect(Collectors.toList()));
        }

        return pageDTO;
    }

    @Override
    public NotificationDetailsDTO selectById(int userId, int notificationId) {
        MeetingNotification notify = getById(notificationId);
        LambdaQueryWrapper<Participants> wrapper = new LambdaQueryWrapper<>();

        if(userId!=NotificationConstants.SYS_ADMIN){
            //判断是否有权限（自己是参与者）
            wrapper.eq(Participants::getReservationId, notify.getReservationId())
                    .eq(Participants::getUserId, userId)
                    .ne(Participants::getStatus,ParticipantsConstants.REFUSED);
        }

        long count = participantsService.count(wrapper);
        if(count==0){
            throw new RuntimeException("无读取权限");
        }

        NotificationDetailsDTO dto = new NotificationDetailsDTO();
        dto.setId(notify.getId());
        dto.setNotifyType(notify.getNotifyType());
        dto.setTitle(notify.getTitle());
        dto.setContent(notify.getContent());
        dto.setSender(getUserName(notify.getSenderId()));
        dto.setCreateTime(notify.getCreateTime());


        return dto;
    }

    private String getUserName(int userID){
        String user;
        if(userID==NotificationConstants.SYS_ADMIN){
            user="ADMIN";
        }else {
            user=userMapper.selectById(userID).getUsername();
        }
        return user;
    }

    private NotificationDTO convert(MeetingNotification notify){
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notify.getId());
        dto.setNotifyType(notify.getNotifyType());
        dto.setTitle(notify.getTitle());
        return dto;
    }
}




