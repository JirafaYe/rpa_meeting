package org.cuit.meeting.web.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.dto.ReservationDTO;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.domain.request.ReservationPageQuery;


/**
* @author 18425
* @description 针对表【reservation(预约表)】的数据库操作Service
* @createDate 2025-03-16 21:56:32
*/
public interface ReservationService extends IService<Reservation>{

    String approve(int id, boolean isAllowed);

    //分页查询，只提供大概信息
    PageDTO<ReservationDTO> summaryPage(ReservationPageQuery page);

    //取消会议
    String cancel(int id, int userId);
}
