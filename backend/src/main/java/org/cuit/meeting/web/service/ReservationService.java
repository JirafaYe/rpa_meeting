package org.cuit.meeting.web.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.dto.ReservationDTO;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.domain.request.ReservationBody;
import org.cuit.meeting.domain.request.ReservationPageQuery;
import org.cuit.meeting.domain.request.SummaryBody;
import org.springframework.web.multipart.MultipartFile;


/**
* @author 18425
* @description 针对表【reservation(预约表)】的数据库操作Service
* @createDate 2025-03-16 21:56:32
*/
public interface ReservationService extends IService<Reservation>{

    String approve(int id, boolean isAllowed);

    /**
     * 分页查询，只提供大概信息
     * @param page
     * @return
     */
    PageDTO<ReservationDTO> summaryPage(ReservationPageQuery page);

    /**
     * 取消会议
     * @param id 会议id
     * @param userId 用户id
     * @return
     */
    String cancel(int id, int userId);

    /**
     * 上传音频文件并生成总结
     * @param reservationId 会议id
     * @param fileKey 音频文件Key
     */
    void uploadAudioAndSummary(int reservationId, String fileKey);

    String book(ReservationBody body, int userId);

    Result<Object> getSummary(int id);

    Result<Object> updateSummary(SummaryBody body);
}
