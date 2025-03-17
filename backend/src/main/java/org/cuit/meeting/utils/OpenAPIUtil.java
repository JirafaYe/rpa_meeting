package org.cuit.meeting.utils;

import com.alibaba.fastjson2.JSON;
import org.cuit.meeting.domain.ChatRequest;
import org.cuit.meeting.domain.CompletionResponse;
import org.cuit.meeting.domain.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import sun.net.www.http.HttpClient;

import java.io.IOException;
import java.net.CacheRequest;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Arrays;

/**
 * @author dingyangwei001
 * @description 描述
 * @date 2025/03/17 19:22
 **/
@Component
public class OpenAPIUtil {
    @Autowired
    private RestTemplate restTemplate;

    private static final String apiKey = "sk-abbf832b4d794b21a0438ad4d9198f9c";

    private static final String baseUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

    public CompletionResponse getCompletion(String prompt) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + apiKey);
        headers.add("Content-Type", "application/json");

        ChatRequest chatRequest = new ChatRequest();
        Message message = Message.builder().role("user").content(prompt).build();
        chatRequest.setMessages(Arrays.asList(message));
        chatRequest.setModel("deepseek-v3");

        HttpEntity<ChatRequest> httpEntity = new HttpEntity<>(chatRequest, headers);

        ResponseEntity<CompletionResponse> completionResponseResponseEntity = restTemplate.postForEntity(baseUrl, httpEntity, CompletionResponse.class);
        return completionResponseResponseEntity.getBody();
    }


}
