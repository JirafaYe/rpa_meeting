package org.cuit.meeting.domain.dto;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.util.Date;

/**
 * @author dingyangwei001
 * @description SubtopicsFileDTO
 * @date 2025/03/30 17:15
 **/
@Data
public class SubtopicsFileDTO {

    /**
     * 主键id
     */
    private Integer id;

    /**
     * 议题id
     */
    private Integer subtopicsId;

    /**
     * 文件名
     */
    private String fileName;

    /**
     * 文件地址
     */
    private String fileKey;

    /**
     * 创建时间
     */
    private Date createTime;
}
