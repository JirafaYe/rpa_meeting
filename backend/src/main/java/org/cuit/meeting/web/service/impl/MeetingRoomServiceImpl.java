package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.constant.MeetingRoomConstants;
import org.cuit.meeting.dao.MeetingRoomMapper;
import org.cuit.meeting.dao.ReservationMapper;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.MeetingRoom;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.domain.request.MeetingRoomBody;
import org.cuit.meeting.web.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;

/**
* @author 18425
* @description 针对表【meeting_room(会议室基础信息表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class MeetingRoomServiceImpl extends ServiceImpl<MeetingRoomMapper, MeetingRoom>
    implements MeetingRoomService {

    @Autowired
    MeetingRoomMapper mapper;

    @Autowired
    ReservationMapper reservationMapper;

    @Override
    public String creatMeetingRoom(MeetingRoomBody body, int userId) {
        String msg = checkBody(body);
        if(StringUtils.isBlank(msg)){
            MeetingRoom room = new MeetingRoom();
            room.setCapacity(body.getCapacity());
            room.setEquipment(body.getEquipment());
            room.setName(body.getName());
            room.setLocation(body.getLocation());
            room.setUserId(userId);
            room.setCreateTime(new Date());
            if (!this.checkRoomNameUnique(room)) {
                msg="名称重复";
            }else if(!save(room)){
                msg="创建会议室失败";
            }
        }

        return msg;
    }

    @Override
    public String updateMeetingRoom(MeetingRoomBody body) {
        if(Objects.isNull(body.getId())){
            return "id不得为空";
        }
        MeetingRoom room = getById(body.getId());
        if(Objects.isNull(room)){
            return "id错误";
        }
        String msg = checkBody(body);
        if(StringUtils.isEmpty(msg)){
            room.setCapacity(body.getCapacity());
            room.setName(body.getName());
            room.setEquipment(body.getEquipment());
            room.setLocation(body.getLocation());
            if(!updateById(room)){
                msg="更新失败";
            }
        }
        return msg;
    }

    @Override
    public String deleteMeetingRoom(int id) {
        String msg;
        Reservation reservation = reservationMapper
                .selectOne(new LambdaQueryWrapper<Reservation>().eq(Reservation::getRoomId, id));
        if(Objects.isNull(reservation)){
            msg= removeById(id)?"":"删除失败";
        }else {
            msg="该会议室存在会议，无法删除";
        }

        return msg;
    }

    @Override
    public PageDTO<MeetingRoom> getPageMeetingRoom(PageQuery query) {
        Page<MeetingRoom> page = mapper.selectPage(query.toMpPage(), new QueryWrapper<>());
        return new PageDTO<>(page);
    }

    private String checkBody(MeetingRoomBody body){
        String msg="";
        if(StringUtils.isEmpty(body.getName())){
            msg="会议室名不得为空";
        } else if(StringUtils.isEmpty(body.getLocation())){
            msg="会议室地址不得为空";
        } else if (body.getCapacity()==null) {
            msg="容量不得为空";
        } else if (StringUtils.isEmpty(body.getEquipment())) {
            msg="设备不得为空";
        } else if (body.getEquipment().length() > MeetingRoomConstants.VARCHAR_MAX_LENGTH
                || body.getLocation().length() > MeetingRoomConstants.VARCHAR_MAX_LENGTH
                || body.getName().length() > MeetingRoomConstants.VARCHAR_MAX_LENGTH) {
            msg="字符串长度超过50";
        }
        return msg;
    }

    private boolean checkRoomNameUnique(MeetingRoom room) {
        Integer userId = Objects.isNull(room.getId()) ? -1 : room.getId();
        MeetingRoom info = this.getOne(new LambdaQueryWrapper<MeetingRoom>().eq(MeetingRoom::getName, room.getName()).last("limit 1"));
        if (Objects.nonNull(info) && info.getId().equals(userId))
        {
            return MeetingRoomConstants.NOT_UNIQUE;
        }
        return MeetingRoomConstants.UNIQUE;
    }

}




