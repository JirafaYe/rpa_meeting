package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.entity.Subtopics;

/**
* @author 18425
* @description 针对表【subtopics(子主题表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:02
* @Entity generator.domain.Subtopics
*/
public interface SubtopicsMapper extends BaseMapper<Subtopics> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(Subtopics record);

    Subtopics selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Subtopics record);

    int updateByPrimaryKey(Subtopics record);

}
