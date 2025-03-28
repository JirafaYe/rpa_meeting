package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.constant.ParticipantsConstants;
import org.cuit.meeting.dao.ParticipantsMapper;
import org.cuit.meeting.dao.ReservationMapper;
import org.cuit.meeting.dao.UserMapper;
import org.cuit.meeting.domain.dto.ParticipantDTO;
import org.cuit.meeting.domain.entity.Participants;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.domain.entity.User;
import org.cuit.meeting.web.service.ParticipantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
* @author 18425
* @description 针对表【participants(参会用户表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class ParticipantsServiceImpl extends ServiceImpl<ParticipantsMapper, Participants>
    implements ParticipantsService {

    @Autowired
    ParticipantsMapper participantsMapper;

    @Autowired
    UserMapper userMapper;

    @Override
    public String joinMeeting(int reservationId, int userId, boolean isJoined) {
        String msg="";
        Participants user = participantsMapper.selectOne(new LambdaQueryWrapper<Participants>()
                .eq(Participants::getReservationId, reservationId).eq(Participants::getUserId, userId));
        if(Objects.isNull(user)){
            msg="会议不存在或无操作权限";
        }else {
            user.setStatus(ParticipantsConstants.ACCEPTED);
            if(!updateById(user)){
                msg="操作失败";
            }
        }
        return msg;
    }

    @Override
    public List<ParticipantDTO> getParticipants(int reservationId, int userId) {
        List<Participants> list = participantsMapper.selectList(new LambdaQueryWrapper<Participants>().eq(Participants::getReservationId, reservationId));
        Set<Integer> users = list.stream().map(Participants::getUserId).collect(Collectors.toSet());

        if(list.isEmpty()){
            throw new RuntimeException("reservationId无效");
        } else if (!users.contains(userId)) {
            throw new RuntimeException("无操作权限");
        }

        Map<Integer, User> map = userMapper.selectList(new LambdaQueryWrapper<User>().in(User::getId, users)).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return list.stream().map(p -> {
            User user = map.get(p.getUserId());
            ParticipantDTO dto = new ParticipantDTO();
            dto.setStatus(p.getStatus());
            dto.setUsername(user.getUsername());
            dto.setAvatarUrl(user.getAvatarUrl());
            return dto;
        }).collect(Collectors.toList());
    }

}




