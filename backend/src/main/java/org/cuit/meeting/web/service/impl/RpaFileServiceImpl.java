package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.dao.RpaFileMapper;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.RpaFile;
import org.cuit.meeting.web.service.RpaFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;

@Service
public class RpaFileServiceImpl extends ServiceImpl<RpaFileMapper, RpaFile> implements RpaFileService{

    @Autowired
    RpaFileMapper rpaFileMapper;

    @Override
    public String upload(String url, String fileName, boolean topped) {
        String msg="";

        if(StringUtils.isBlank(url)){
            return "url不得为空";
        } else if (StringUtils.isBlank(fileName)) {
            return "文件名不得为空";
        }

        RpaFile file = new RpaFile();
        file.setFileName(fileName);
        file.setFileUrl(url);
        file.setTopped(topped?1:0);
        file.setCreateTime(new Date());
        if(!save(file)){
            msg="上传失败";
        }

        return msg;
    }

    @Override
    public String deleteFile(int fileId) {
        RpaFile file = rpaFileMapper.selectById(fileId);
        if(Objects.isNull(file)){
            return "fileId不存在";
        }
        if(!removeById(fileId)){
            return "删除失败";
        }
        return "";
    }

    @Override
    public PageDTO<RpaFile> pageFiles(PageQuery query) {
        LambdaQueryWrapper<RpaFile> w = new LambdaQueryWrapper<>();
        w.orderByDesc(RpaFile::getTopped).orderByDesc(RpaFile::getCreateTime);

        Page<RpaFile> page = page(query.toMpPage(), w);

        return new PageDTO<>(page);
    }
}
