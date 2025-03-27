package org.cuit.meeting.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.MeetingRoom;
import org.cuit.meeting.domain.request.MeetingRoomBody;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 会议室操作
 */
@RestController
@RequestMapping("/room")
public class MeetingRoomController {

    @Autowired
    MeetingRoomService meetingRoomService;

    /**
     * 管理员添加会议室
     * @param body
     * @return
     */
    @PostMapping("/create")
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public Result<String> createRoom(@RequestBody MeetingRoomBody body){
        String msg = meetingRoomService
                .creatMeetingRoom(body, SecurityUtils.getUserId());
        return StringUtils.isBlank(msg)
                ?Result.ok():Result.fail(msg);

    }

    /**
     * 分页查询会议室
     * @param query
     * @return
     */
    @GetMapping("")
    public Result<PageDTO<MeetingRoom>> pageQueryRooms(PageQuery query){
        PageDTO<MeetingRoom> res = meetingRoomService.getPageMeetingRoom(query);
        return Result.ok(res);
    }

    /**
     * 管理员更新会议室信息
     * @param body
     * @return
     */
    @PutMapping("/update")
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public Result<String> updateRoom(@RequestBody MeetingRoomBody body){
        String msg = meetingRoomService.updateMeetingRoom(body);
        return StringUtils.isBlank(msg)
                ?Result.ok():Result.fail(msg);
    }

    /**
     * 管理员删除会议室
     * @param id 会议室id
     * @return
     */
    @DeleteMapping("{id}")
    @PreAuthorize("@ss.hasAnyRoles('ADMIN')")
    public Result<String> deleteById(@PathVariable("id") int id){
        String msg = meetingRoomService.deleteMeetingRoom(id);
        return StringUtils.isBlank(msg)
                ? Result.ok():Result.fail(msg);
    }
}
