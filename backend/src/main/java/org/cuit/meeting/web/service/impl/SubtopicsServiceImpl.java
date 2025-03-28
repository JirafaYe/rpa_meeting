package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.constant.SubTopicsConstants;
import org.cuit.meeting.dao.ParticipantsMapper;
import org.cuit.meeting.dao.SubtopicsMapper;
import org.cuit.meeting.domain.entity.Participants;
import org.cuit.meeting.domain.entity.Subtopics;
import org.cuit.meeting.domain.request.SubtopicsBody;
import org.cuit.meeting.domain.request.SubtopicsUpdateBody;
import org.cuit.meeting.web.service.SubtopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

/**
* @author 18425
* @description 针对表【subtopics(子主题表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class SubtopicsServiceImpl extends ServiceImpl<SubtopicsMapper, Subtopics>
    implements SubtopicsService {

    @Autowired
    ParticipantsMapper participantsMapper;

    @Autowired
    SubtopicsMapper subtopicsMapper;

    @Override
    public String create(int userId, SubtopicsBody body) {
        String msg = checkParams(userId, body);
        if(!StringUtils.isBlank(msg)) return msg;

        Subtopics subtopics = new Subtopics();
        subtopics.setSubtopics(body.getSubtopics());
        subtopics.setDescription(body.getDescription());
        subtopics.setReservationId(body.getReservationId());
        if(subtopicsMapper.insertSelective(subtopics)!=1){
            msg="创建失败";
        }

        return msg;
    }

    @Override
    public String update(int userId, SubtopicsUpdateBody body) {
        String msg = checkParams(userId, body);
        if(Objects.isNull(body.getId())){
            msg="id不可为空";
        }
        if(!StringUtils.isBlank(msg)) return msg;

        Subtopics subtopics = new Subtopics();
        subtopics.setSubtopics(body.getSubtopics());
        subtopics.setDescription(body.getDescription());
        subtopics.setReservationId(body.getReservationId());
        subtopics.setId(body.getId());
        if(subtopicsMapper.updateById(subtopics)!=1){
            msg="创建失败";
        }

        return msg;
    }

    /**
     * 判断是否唯一
     * @param reservationId 会议id
     * @param topic 子议题
     * @return
     */
    private boolean checkUnique(int reservationId, String topic){
        LambdaQueryWrapper<Subtopics> w = new LambdaQueryWrapper<Subtopics>().eq(Subtopics::getReservationId, reservationId)
                .eq(Subtopics::getSubtopics, topic);
        return subtopicsMapper.selectCount(w) == 0L;
    }

    private String checkParams(int userId, SubtopicsBody body) {
        String msg="";
        if(StringUtils.isBlank(body.getSubtopics())){
            msg ="子议题不得为空";
        } else if (Objects.isNull(body.getReservationId())) {
            msg ="会议id不得为空";
        } else if (body.getSubtopics().length() > SubTopicsConstants.TOPIC_LENGTH) {
            msg ="子议题长度不得大于"+SubTopicsConstants.TOPIC_LENGTH;
        } else if (!StringUtils.isBlank(body.getDescription())
                && body.getDescription().length() > SubTopicsConstants.DESCRIPTION_LENGTH) {
            msg ="描述长度不得大于"+SubTopicsConstants.DESCRIPTION_LENGTH;
        }else {
            LambdaQueryWrapper<Participants> w = new LambdaQueryWrapper<Participants>()
                    .eq(Participants::getReservationId, body.getReservationId()).eq(Participants::getUserId, userId);
            Participants one = participantsMapper.selectOne(w);

            if(Objects.isNull(one)){
                msg ="会议id无效或无操作权限";
            } else if (!checkUnique(body.getReservationId(), body.getSubtopics())) {
                msg ="子议题重复";
            }
        }
        return msg;
    }
}




