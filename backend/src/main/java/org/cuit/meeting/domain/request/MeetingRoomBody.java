package org.cuit.meeting.domain.request;


import lombok.Data;

@Data
public class MeetingRoomBody {
    /**
     * 主键id
     */
    private Integer id;
    /**
     * 会议室名称
     */
    private String name;

    /**
     * 所在位置
     */
    private String location;

    /**
     * 容纳人数
     */
    private Integer capacity;

    /**
     * 设备
     */
    private String equipment;
}
