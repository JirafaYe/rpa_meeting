package org.cuit.meeting.web.controller;

import org.cuit.meeting.domain.Result;
import org.cuit.meeting.web.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 会议音频
 * @author Devildyw
 * @date 2025/03/25 21:52
 **/
@RequestMapping("/meeting/audio")
@RestController
public class MeetingAudioController {

    @Autowired
    private ReservationService reservationService;

    /**
     * 上传音频文件并生成总结
     * @param reservationId
     * @param fileUrl
     * @return
     */
    @PostMapping("{reservationId}")
    public Result uploadAudio(@PathVariable("reservationId") int reservationId, @RequestParam("fileUrl") String fileUrl) {
        reservationService.uploadAudioAndSummary(reservationId, fileUrl);
        return Result.ok();
    }
}