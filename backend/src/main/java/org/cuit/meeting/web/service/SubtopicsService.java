package org.cuit.meeting.web.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.entity.Subtopics;
import org.cuit.meeting.domain.request.SubtopicsBody;
import org.cuit.meeting.domain.request.SubtopicsUpdateBody;


/**
* @author 18425
* @description 针对表【subtopics(子主题表)】的数据库操作Service
* @createDate 2025-03-16 21:56:32
*/
public interface SubtopicsService extends IService<Subtopics> {

    String create(int userId, SubtopicsBody body);

    String update(int userId, SubtopicsUpdateBody body);

    Result<Object> uploadFile(Integer subId, String fileKey);
}
