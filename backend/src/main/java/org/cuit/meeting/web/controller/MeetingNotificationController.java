package org.cuit.meeting.web.controller;

import org.cuit.meeting.constant.NotificationConstants;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.MeetingNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notify")
public class MeetingNotificationController {

    @Autowired
    MeetingNotificationService service;

    //只返回大概信息，详细信息通过id查看
    @GetMapping("")
    public AjaxResult pageQuery(PageQuery query){
        Integer userId = SecurityUtils.getUserId();
        return AjaxResult.success(service.pageQuery(query,userId));
    }

    //通过id查看细节
    @GetMapping("{id}")
    public AjaxResult queryDetailsById(@PathVariable("id") int id){
        Integer userId = SecurityUtils.getUserId();
        return AjaxResult.success(service.selectById(userId,id));
    }

    //管理员通过id查看通知（可查看所有通知）
    @GetMapping("/admin/{id}")
    @PreAuthorize("ss.hasAnyRoles('admin')")
    public AjaxResult queryDetailsByAdmin(@PathVariable("id") int id){
        return AjaxResult
                .success(service.selectById(NotificationConstants.SYS_ADMIN,id));
    }
}
