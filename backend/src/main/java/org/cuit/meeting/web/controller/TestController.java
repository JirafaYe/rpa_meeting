package org.cuit.meeting.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Devildyw
 * @date 2025/03/16 21:59
 **/
@RestController("/test")
public class TestController {

    @RequestMapping("/test")
    public String test() {
        return "Hello World!";
    }
}