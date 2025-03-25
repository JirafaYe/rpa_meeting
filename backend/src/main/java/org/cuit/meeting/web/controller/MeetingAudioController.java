package org.cuit.meeting.web.controller;

import org.cuit.meeting.domain.Result;
import org.cuit.meeting.web.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
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
     * @param file
     * @return
     */
    @PostMapping("{reservationId}")
    public Result uploadAudio(@PathVariable("reservationId") int reservationId, MultipartFile file) {
        reservationService.uploadAudioAndSummary(reservationId, file);
        return Result.ok();
    }
}