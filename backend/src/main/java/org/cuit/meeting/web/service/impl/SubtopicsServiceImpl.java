package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.constant.SubTopicsConstants;
import org.cuit.meeting.dao.ParticipantsMapper;
import org.cuit.meeting.dao.SubtopicsMapper;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.entity.Participants;
import org.cuit.meeting.domain.entity.Subtopics;
import org.cuit.meeting.domain.entity.SubtopicsFile;
import org.cuit.meeting.domain.request.SubtopicsBody;
import org.cuit.meeting.domain.request.SubtopicsUpdateBody;
import org.cuit.meeting.web.service.FileService;
import org.cuit.meeting.web.service.SubtopicsFileService;
import org.cuit.meeting.web.service.SubtopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

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

    @Autowired
    private FileService fileService;

    @Autowired
    private SubtopicsFileService subtopicsFileService;

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

    @Override
    public Result<Object> uploadFile(Integer subId, String fileName, String fileUrl) {
        Subtopics subtopics = subtopicsMapper.selectById(subId);
        if (Objects.isNull(subtopics)) {
            return Result.fail("子议题不存在");
        }

        // 获取到文件的key
        SubtopicsFile subtopicsFile = new SubtopicsFile();
        subtopicsFile.setSubtopicsId(subId);

        subtopicsFile.setFileName(fileName);
        subtopicsFile.setFileUrl(fileUrl);
        subtopicsFile.setCreateTime(new Date());
        subtopicsFileService.save(subtopicsFile);
        return Result.ok();
    }

    /**
     * 删除子议题
     * @param subId
     * @return
     */
    @Override
    public Result<Object> delete(Integer subId) {
        Subtopics subtopics = subtopicsMapper.selectById(subId);
        if (Objects.isNull(subtopics)) {
            return Result.fail("子议题不存在");
        }

        subtopicsMapper.deleteById(subId);
        return Result.ok();
    }

    /**
     * 删除子议题文件
     * @param subFileId 子议题id
     * @return 删除结果
     */
    @Override
    public Result<Object> deleteFile(Integer subFileId) {
        SubtopicsFile subtopicsFile = subtopicsFileService.getById(subFileId);
        if (Objects.isNull(subtopicsFile)) {
            return Result.fail("文件不存在");
        }

        subtopicsFileService.removeById(subFileId);
        return Result.ok();
    }

    @Override
    public Result<List<SubtopicsFile>> listFile(Integer subId) {
        Subtopics subtopics = this.getById(subId);
        if (Objects.isNull(subtopics)) {
            return Result.fail("子议题不存在");
        }

        // 查询子议题文件列表
        List<SubtopicsFile> list = subtopicsFileService.list(new LambdaQueryWrapper<SubtopicsFile>().eq(SubtopicsFile::getSubtopicsId, subId));
        if (CollectionUtils.isEmpty(list)) {
            return Result.ok(new ArrayList<SubtopicsFile>());
        }

        // 转换为DTO
        return Result.ok(list);
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




