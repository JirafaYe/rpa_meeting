package org.cuit.meeting.web.service;


import com.baomidou.mybatisplus.extension.service.IService;
import org.cuit.meeting.domain.dto.ParticipantDTO;
import org.cuit.meeting.domain.entity.Participants;

import java.util.List;

/**
* @author 18425
* @description 针对表【participants(参会用户表)】的数据库操作Service
* @createDate 2025-03-16 21:56:32
*/
public interface ParticipantsService extends IService<Participants> {
    /**
     * 同意/拒绝参加会议
     */
    String joinMeeting(int reservationId, int userId, boolean isJoined);

    /**
     * 暂时为仅参会人员可查看
     */
    List<ParticipantDTO> getParticipants(int reservationId, int userId);
}
