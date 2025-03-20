package org.cuit.meeting.web.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.MeetingRoom;
import org.cuit.meeting.domain.request.MeetingRoomBody;


/**
* @author 18425
* @description 针对表【meeting_room(会议室基础信息表)】的数据库操作Service
* @createDate 2025-03-16 21:56:32
*/
public interface MeetingRoomService extends IService<MeetingRoom> {

    String creatMeetingRoom(MeetingRoomBody body, int roleId);

    String updateMeetingRoom(MeetingRoomBody body);

    String deleteMeetingRoom(int id);

    PageDTO<MeetingRoom> getPageMeetingRoom(PageQuery query);
}
