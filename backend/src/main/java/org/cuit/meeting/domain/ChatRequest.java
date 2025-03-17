package org.cuit.meeting.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Data;

import java.util.List;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatRequest {
    private String model;
    private List<Message> messages;



    // 建议添加的功能：
    // 1. 使用@JsonFormat处理时间戳转换
    // 2. 实现Validation接口做参数校验
    // 3. 添加消息体加密注解
}