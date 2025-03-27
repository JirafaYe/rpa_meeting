package org.cuit.meeting.web.controller;

import org.cuit.meeting.constant.NotificationConstants;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.NotificationDTO;
import org.cuit.meeting.domain.dto.NotificationDetailsDTO;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.MeetingNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 通知操作
 */
@RestController
@RequestMapping("/notify")
public class MeetingNotificationController {

    @Autowired
    MeetingNotificationService service;

    /**
     * 分页查询通知
     * @param query
     * @return
     */
    //只返回大概信息，详细信息通过id查看
    @GetMapping("")
    public Result<PageDTO<NotificationDTO>> pageQuery(PageQuery query){
        Integer userId = SecurityUtils.getUserId();
        return Result.ok(service.pageQuery(query,userId));
    }

    /**
     * 通过id查看通知
     * @param id
     * @return
     */
    //通过id查看细节
    @GetMapping("{id}")
    public Result<NotificationDetailsDTO> queryDetailsById(@PathVariable("id") int id){
        Integer userId = SecurityUtils.getUserId();
        NotificationDetailsDTO dto = service.selectById(userId, id);
        return Result.ok(dto);
    }

    /**
     * 管理员通过id查看通知
     * @param id
     * @return
     */
    //管理员通过id查看通知（可查看所有通知）
    @GetMapping("/admin/{id}")
    @PreAuthorize("@ss.hasAnyRoles('admin')")
    public Result<NotificationDetailsDTO> queryDetailsByAdmin(@PathVariable("id") int id){
        NotificationDetailsDTO dto = service.selectById(NotificationConstants.SYS_ADMIN, id);
        return Result.ok(dto);
    }
}
