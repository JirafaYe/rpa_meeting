package org.cuit.meeting.web.controller;

import com.alibaba.fastjson2.JSON;
import org.cuit.meeting.domain.CompletionResponse;
import org.cuit.meeting.utils.OpenAPIUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

/**
 * @author Devildyw
 * @date 2025/03/16 21:59
 **/
@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private OpenAPIUtil openAIClient;

//    @Autowired
//    private
//
    @RequestMapping("/test")
    public String test(@RequestParam String prompt) throws IOException {
        CompletionResponse completion = openAIClient.getCompletion(prompt);
        return JSON.toJSONString(completion);
    }


}