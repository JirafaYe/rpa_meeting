package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.constant.NotificationConstants;
import org.cuit.meeting.constant.ReservationConstants;
import org.cuit.meeting.dao.ReservationMapper;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.dto.ReservationDTO;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.domain.request.ReservationPageQuery;
import org.cuit.meeting.web.service.MeetingNotificationService;
import org.cuit.meeting.web.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
* @author 18425
* @description 针对表【reservation(预约表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class ReservationServiceImpl extends ServiceImpl<ReservationMapper, Reservation>
    implements ReservationService {

    @Autowired
    MeetingNotificationService notificationService;

    @Override
    public String approve(int id, boolean isAllowed) {
        String msg="";
        //todo 判断权限
        Reservation meeting = getById(id);
        if(Objects.isNull(meeting)){
            msg="预约id错误";
        }else {
            meeting.setStatus(isAllowed?ReservationConstants.ALLOW
                    :ReservationConstants.REFUSED);
            if(!updateById(meeting)){
                msg="审批失败";
            }else {
                if(!notificationService.notifyApprove(meeting,isAllowed)){
                    msg="通知失败";
                }
            }
        }
        return msg;
    }

    @Override
    public PageDTO<ReservationDTO> summaryPage(ReservationPageQuery query) {
        LambdaQueryWrapper<Reservation> wrapper = new LambdaQueryWrapper<>();

        //两种只能存在一种
        if(!Objects.isNull(query.getReserveDate())){
            wrapper.eq(Reservation::getReserveDate,query.getReserveDate());
        }else if(!Objects.isNull(query.getStartTime())&&!Objects.isNull(query.getEndTime())){
            //查询开始时间在范围内的会议
            wrapper.ge(Reservation::getStartTime,query.getStartTime());
            wrapper.le(Reservation::getStartTime,query.getEndTime());
        }

        Page<Reservation> page = page(query.toMpPage(),wrapper);
        PageDTO<ReservationDTO> res = new PageDTO<>();
        res.setPages(page.getPages());
        res.setTotal(page.getTotal());
        if(!Objects.isNull(page.getRecords())){
            List<Reservation> records = page.getRecords();
            res.setList(records.stream().map(this::convert).collect(Collectors.toList()));
        }
        return res;
    }

    @Override
    public String cancel(int id, int userID) {
        //todo：通知是否需要事务?
        Reservation reservation = getById(id);
        String msg="";
        if(Objects.isNull(reservation)){
            msg="会议id不存在";
        } else if (reservation.getStatus() == ReservationConstants.REFUSED) {
            msg="会议已失效";
        } else if (reservation.getStartTime().before(new Date())) {
            msg="会议已开始";
        }else if (userID!= NotificationConstants.SYS_ADMIN &&reservation.getBookerId()!=userID) {
            msg="非本人预约，无权限";
        }else {
            reservation.setStatus(ReservationConstants.REFUSED);
            if(!updateById(reservation)){
                msg="取消失败，会议id:"+id;
            }else {
                if(!notificationService.notify(reservation,ReservationConstants.REFUSED)){
                    msg="通知记录失败";
                }
            }
        }
        return msg;
    }

    private ReservationDTO convert(Reservation record){
        ReservationDTO dto = new ReservationDTO();
        dto.setId(record.getId());
        dto.setDescription(record.getDescription());
        dto.setReserveDate(record.getReserveDate());
        String status;
        switch (record.getStatus()){
            case ReservationConstants.ALLOW:
                status=ReservationConstants.RESP_ALLOW;
                break;
            case ReservationConstants.REFUSED:
                status=ReservationConstants.RESP_REFUSED;
                break;
            default:
                status=ReservationConstants.RESP_NORMAL;
        }
        dto.setStatus(status);
        dto.setStartTime(record.getStartTime());
        dto.setEndTime(record.getEndTime());
        dto.setBookerId(record.getBookerId());
        dto.setTopic(record.getTopic());
        dto.setRoomId(record.getRoomId());
        return dto;
    }
}




