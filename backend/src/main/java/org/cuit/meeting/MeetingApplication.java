package org.cuit.meeting;


import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.annotation.MapperScans;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * @description: 会议管理系统启动类
 * @author Devildyw
 * @date 2025/03/16 21:00
 */
@EnableConfigurationProperties
@MapperScan("org.cuit.meeting.dao")
@SpringBootApplication
@EnableAsync
public class MeetingApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeetingApplication.class, args);
    }
}