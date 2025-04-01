package org.cuit.meeting.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.RpaFile;
import org.cuit.meeting.web.service.RpaFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * rpa操作（只有管理员可用）
 */
@RestController
@RequestMapping("/rpa")
public class RpaFileController {

    @Autowired
    RpaFileService rpaFileService;

    /**
     * 上传文件
     * @param url 文件url
     * @param fileName 文件名
     * @param topped 是否置顶
     * @return
     */
    @PostMapping("")
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public Result<Object> create(@RequestParam("url") String url
            , @RequestParam("name") String fileName, @RequestParam("topped") boolean topped){
        String msg = rpaFileService.upload(url, fileName, topped);
        return StringUtils.isBlank(msg)?Result.ok():Result.fail(msg);
    }

    /**
     * 根据id删除文件
     * @param id 主键id
     * @return
     */
    @DeleteMapping("{id}")
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public Result<Object> delete(@PathVariable("id") int id){
        String msg = rpaFileService.deleteFile(id);
        return StringUtils.isBlank(msg)?Result.ok():Result.fail(msg);
    }

    /**
     * 分页查询rpa文件
     * @param query
     * @return
     */
    @GetMapping()
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public PageDTO<RpaFile> page(PageQuery query){
        return rpaFileService.pageFiles(query);
    }


}
