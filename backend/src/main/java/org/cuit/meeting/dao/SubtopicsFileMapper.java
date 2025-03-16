package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.SubtopicsFile;

/**
* @author 18425
* @description 针对表【subtopics_file(议题文件表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:02
* @Entity generator.domain.SubtopicsFile
*/
public interface SubtopicsFileMapper extends BaseMapper<SubtopicsFile> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(SubtopicsFile record);

    SubtopicsFile selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(SubtopicsFile record);

    int updateByPrimaryKey(SubtopicsFile record);

}
