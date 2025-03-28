package org.cuit.meeting.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.request.SubtopicsBody;
import org.cuit.meeting.domain.request.SubtopicsUpdateBody;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.SubtopicsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
     * @param fileKey
     * @return
     */
    @PostMapping("/upload/file/{subId}")
    public Result<Object> uploadFile(@PathVariable("subId") Integer subId, @RequestParam String fileKey){
        return subtopicsService.uploadFile(subId, fileKey);
    }
}
