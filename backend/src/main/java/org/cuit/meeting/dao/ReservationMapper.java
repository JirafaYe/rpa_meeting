package org.cuit.meeting.dao;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.cuit.meeting.domain.Reservation;

/**
* @author 18425
* @description 针对表【reservation(预约表)】的数据库操作Mapper
* @createDate 2025-03-16 22:11:02
* @Entity generator.domain.Reservation
*/
public interface ReservationMapper extends BaseMapper<Reservation> {

    int deleteByPrimaryKey(Long id);

    int insertSelective(Reservation record);

    Reservation selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Reservation record);

    int updateByPrimaryKey(Reservation record);

}
