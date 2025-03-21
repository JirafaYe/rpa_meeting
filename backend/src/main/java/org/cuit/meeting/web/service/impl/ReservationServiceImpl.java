package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.cuit.meeting.constant.ReservationConstants;
import org.cuit.meeting.dao.ReservationMapper;
import org.cuit.meeting.domain.PageQuery;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.dto.ReservationDTO;
import org.cuit.meeting.domain.entity.Reservation;
import org.cuit.meeting.web.service.ReservationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
* @author 18425
* @description 针对表【reservation(预约表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Service
public class ReservationServiceImpl extends ServiceImpl<ReservationMapper, Reservation>
    implements ReservationService {

    @Override
    public String approve(int id, boolean isAllowed) {
        String msg="";
        //todo 判断权限,通知
        Reservation meeting = getById(id);
        if(Objects.isNull(meeting)){
            msg="预约id错误";
        }else {
            meeting.setStatus(isAllowed?ReservationConstants.ALLOW
                    :ReservationConstants.REFUSED);
            if(!updateById(meeting)){
                msg="审批失败";
            }
        }
        return msg;
    }

    @Override
    public PageDTO<ReservationDTO> approvePage(PageQuery query) {
        Page<Reservation> page = page(query.toMpPage());
        PageDTO<ReservationDTO> res = new PageDTO<>();
        res.setPages(page.getPages());
        res.setTotal(page.getTotal());
        if(!Objects.isNull(page.getRecords())){
            List<Reservation> records = page.getRecords();
            res.setList(records.stream().map(this::convert).collect(Collectors.toList()));
        }
        return res;
    }

    private ReservationDTO convert(Reservation record){
        ReservationDTO dto = new ReservationDTO();
        dto.setId(record.getId());
        dto.setDescription(record.getDescription());
        dto.setReserveDate(record.getReserveDate());
        String status;
        switch (record.getStatus()){
            case ReservationConstants.ALLOW:
                status=ReservationConstants.RESP_ALLOW;
                break;
            case ReservationConstants.REFUSED:
                status=ReservationConstants.RESP_REFUSED;
                break;
            default:
                status=ReservationConstants.RESP_NORMAL;
        }
        dto.setStatus(status);
        dto.setStartTime(record.getStartTime());
        dto.setEndTime(record.getEndTime());
        dto.setBookerId(record.getBookerId());
        dto.setTopic(record.getTopic());
        dto.setRoomId(record.getRoomId());
        return dto;
    }
}




