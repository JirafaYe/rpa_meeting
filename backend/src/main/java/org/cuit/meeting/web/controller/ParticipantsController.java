package org.cuit.meeting.web.controller;

import io.lettuce.core.dynamic.annotation.Param;
import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.ParticipantDTO;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.ParticipantsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 参会人员
 */
@RestController
@RequestMapping("/participants")
public class ParticipantsController {
    @Autowired
    ParticipantsService participantsService;

    /**
     * 确认是否参加会议
     * @param id 会议id
     * @param join 是否参加
     */
    @PutMapping("/join")
    public Result<Object> isJoin(@RequestParam("id") int id, @RequestParam("join") boolean join){
        Integer userId = SecurityUtils.getUserId();
        String msg = participantsService.joinMeeting(id, userId, join);
        return StringUtils.isBlank(msg)
                ?Result.ok():Result.fail(msg);
    }

    /**
     * 查看参会人员
     * @param id 会议id
     * @return
     */
    @GetMapping("{id}")
    public Result<List<ParticipantDTO>> getParticipants(@PathVariable("id") int id){
        Integer userId = SecurityUtils.getUserId();
        return Result.ok(participantsService.getParticipants(id,userId));
    }
}
