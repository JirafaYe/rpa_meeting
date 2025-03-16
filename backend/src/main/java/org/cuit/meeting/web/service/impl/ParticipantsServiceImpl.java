package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.dao.ParticipantsMapper;
import org.cuit.meeting.domain.entity.Participants;
import org.cuit.meeting.web.service.ParticipantsService;
import org.springframework.stereotype.Service;

/**
* @author 18425
* @description 针对表【participants(参会用户表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class ParticipantsServiceImpl extends ServiceImpl<ParticipantsMapper, Participants>
    implements ParticipantsService {

}




