package org.cuit.meeting.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.entity.SubtopicsFile;
import org.cuit.meeting.domain.request.SubtopicsBody;
import org.cuit.meeting.domain.request.SubtopicsUpdateBody;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.SubtopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 子议题操作
 */
@RestController
@RequestMapping("/sub")
public class SubTopicsController {
    @Autowired
    SubtopicsService subtopicsService;

    /**
     * 创建子议题
     * 描述可以为空
     * @param body
     * @return
     */
    @PostMapping("")
    public Result<Object> create(@RequestBody SubtopicsBody body){
        String msg = subtopicsService.create(SecurityUtils.getUserId(), body);
        return StringUtils.isBlank(msg)?Result.ok()
                :Result.fail(msg);
    }

    /**
     * 修改子议题
     * 描述可以为空，id不可为空
     * @return
     */
    @PutMapping("")
    public Result<Object> update(@RequestBody SubtopicsUpdateBody body){
        String msg = subtopicsService.update(SecurityUtils.getUserId(), body);
        return StringUtils.isBlank(msg)?Result.ok()
                :Result.fail(msg);
    }


    /**
     * 上传子议题文件（前端许校验文件格式仅限PDF）
     * @param subId
     * @param fileUrl
     * @return
     */
    @PostMapping("/upload/file/{subId}")
    public Result<Object> uploadFile(@PathVariable("subId") Integer subId, @RequestParam String fileName, @RequestParam String fileUrl){
        return subtopicsService.uploadFile(subId, fileName, fileUrl);
    }

    /**
     * 删除子议题
     * @param subId
     * @return
     */
    @DeleteMapping("/{subId}")
    public Result<Object> delete(@PathVariable("subId") Integer subId){
        return subtopicsService.delete(subId);
    }

    /**
     * 删除子议题文件 （删除数据库记录 不删除文件 简化开发成本不删除源文件了）
     * @param subFileId 子议题文件id
     * @return 删除结果
     */
    @DeleteMapping("/file/{subFileId}")
    public Result<Object> deleteFile(@PathVariable("subFileId") Integer subFileId){
        return subtopicsService.deleteFile(subFileId);
    }

    /**
     * 获取子议题文件列表
     * @param subId 子议题id
     * @return 文件列表
     */
    @GetMapping("/{subId}/file/list")
    public Result<List<SubtopicsFile>> listFile(@PathVariable("subId") Integer subId){
        return subtopicsService.listFile(subId);
    }
}
