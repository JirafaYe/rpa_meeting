package org.cuit.meeting.web.service;

import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.RpaFile;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author 叶朗硕
* @description 针对表【rpa_file】的数据库操作Service
* @createDate 2025-03-31 23:21:52
*/
public interface RpaFileService extends IService<RpaFile> {

    String upload(String url, String fileName, boolean topped);

    String deleteFile(int fileId);

    PageDTO<RpaFile> pageFiles(PageQuery query);
}
