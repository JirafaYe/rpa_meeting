package org.cuit.meeting.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.MeetingRoom;
import org.cuit.meeting.domain.request.MeetingRoomBody;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/room")
public class MeetingRoomController {

    @Autowired
    MeetingRoomService meetingRoomService;

    @PostMapping("/create")
    @PreAuthorize("ss.hasAnyRoles('admin')")
    public AjaxResult createRoom(@RequestBody MeetingRoomBody body){
        String res = meetingRoomService
                .creatMeetingRoom(body, SecurityUtils.getUserId());
        return StringUtils.isBlank(res)
                ?AjaxResult.success():AjaxResult.error(res);

    }

    @GetMapping("")
    public AjaxResult pageQueryRooms(PageQuery query){
        PageDTO<MeetingRoom> res = meetingRoomService.getPageMeetingRoom(query);
        return AjaxResult.success(res);
    }

    @PutMapping("/update")
    @PreAuthorize("ss.hasAnyRoles('admin')")
    public AjaxResult updateRoom(@RequestBody MeetingRoomBody body){
        String msg = meetingRoomService.updateMeetingRoom(body);
        return StringUtils.isBlank(msg)
                ?AjaxResult.success():AjaxResult.error(msg);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("ss.hasAnyRoles('admin')")
    public AjaxResult deleteById(@PathVariable("id") int id){
        String msg = meetingRoomService.deleteMeetingRoom(id);
        return StringUtils.isBlank(msg)
                ?AjaxResult.success():AjaxResult.error(msg);
    }
}
