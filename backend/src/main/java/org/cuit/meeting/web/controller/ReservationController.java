package org.cuit.meeting.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.constant.NotificationConstants;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.dto.ReservationDTO;
import org.cuit.meeting.domain.request.ReservationBody;
import org.cuit.meeting.domain.request.ReservationPageQuery;
import org.cuit.meeting.domain.request.SummaryBody;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;


/**
 * 会议预约
 */
@RestController
@RequestMapping("/reservation")
public class ReservationController {

    @Autowired
    ReservationService reservationService;

    /**
     * 分页查询会议
     * @param page
     * @return
     */
    @GetMapping("")
    public Result<PageDTO<ReservationDTO>> pageQuerySummary(ReservationPageQuery page){
        PageDTO<ReservationDTO> res = reservationService.summaryPage(page);
        return Result.ok(res);
    }

    /**
     * 管理员审批会议
     * @param id 会议id
     * @param isAllowed 是否通过
     * @return
     */
    @PutMapping("/approve")
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public Result<String> approve(@RequestParam("id") int id
            , @RequestParam("isAllowed") boolean isAllowed){
        String msg = reservationService.approve(id, isAllowed);
        return StringUtils.isBlank(msg)
                ?Result.ok():Result.fail(msg);
    }

    /**
     * 取消会议
     * @param id
     * @return
     */
    @PutMapping("{id}")
    public Result<String > cancelById(@PathVariable("id") int id){
        Integer userId = SecurityUtils.getUserId();
        String msg = reservationService.cancel(id, userId);
        return StringUtils.isBlank(msg)
                ?Result.ok():Result.fail(msg);
    }

    /**
     * 管理员取消会议
     * @param id
     * @return
     */
    @PutMapping("/admin/{id}")
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public Result<String> cancelByAdmin(@PathVariable("id") int id){
        String msg = reservationService.cancel(id
                , NotificationConstants.SYS_ADMIN);
        return StringUtils.isBlank(msg)
                ?Result.ok():Result.fail(msg);
    }

    /**
     * 预约会议
     * @param body
     * @return
     */
    @PostMapping("/book")
    public Result<Object> book(@RequestBody ReservationBody body){
        Integer userId = SecurityUtils.getUserId();
        String msg = reservationService.book(body, userId);
        Result<Object> result;
        try {
            int id = Integer.parseInt(msg);
            result = Result.ok(new HashMap<String, Integer>() {{ put("id", id); }});
        } catch (NumberFormatException e) {
            result=Result.fail(msg);
        }
        return result;
    }

    /**
     * 获取会议摘要
     * @param id 会议id
     * @return 会议摘要
     */
    @GetMapping("/{id}/summary")
    public Result<Object> getSummary(@PathVariable("id") int id){
        return reservationService.getSummary(id);
    }

    /**
     * 修改会议摘要
     * @param body 会议摘要body
     * @return 修改结果
     */
    @PutMapping("/summary")
    public Result<Object> updateSummary(@RequestBody SummaryBody body){
        return reservationService.updateSummary(body);
    }
}
