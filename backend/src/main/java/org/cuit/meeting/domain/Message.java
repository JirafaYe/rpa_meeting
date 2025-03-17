package org.cuit.meeting.domain;

import lombok.Builder;
import lombok.Data;

@Builder
@Data  // Lombok注解自动生成getter/setter
public class Message {
    private String role;
    private String content;
}