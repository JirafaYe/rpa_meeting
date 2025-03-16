package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.dao.ReservationMapper;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.web.service.ReservationService;
import org.springframework.stereotype.Service;

/**
* @author 18425
* @description 针对表【reservation(预约表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class ReservationServiceImpl extends ServiceImpl<ReservationMapper, Reservation>
    implements ReservationService {

}




