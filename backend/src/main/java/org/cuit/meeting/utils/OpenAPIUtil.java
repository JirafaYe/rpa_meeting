package org.cuit.meeting.utils;

import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationParam;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.common.GeneralGetParam;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
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

//    public CompletionResponse getCompletion(String prompt) throws IOException {
//        HttpHeaders headers = new HttpHeaders();
//        headers.add("Authorization", "Bearer " + apiKey);
//        headers.add("Content-Type", "application/json");
//
//        ChatRequest chatRequest = new ChatRequest();
//        Message message = Message.builder().role("user").content(prompt).build();
//        chatRequest.setMessages(Arrays.asList(message));
//        chatRequest.setModel("deepseek-v3");
//
//        HttpEntity<ChatRequest> httpEntity = new HttpEntity<>(chatRequest, headers);
//
//        ResponseEntity<CompletionResponse> completionResponseResponseEntity = restTemplate.postForEntity(baseUrl, httpEntity, CompletionResponse.class);
//        return completionResponseResponseEntity.getBody();
//    }

    public GenerationResult getCompletion(String prompt)  {
        Generation gen = new Generation();
        Message userMessage = Message.builder()
                .role(Role.USER.getValue())
                .content(prompt)
                .build();
        GenerationParam param = GenerationParam.builder()
                .apiKey(apiKey)
                .model("deepseek-v3")
                .messages(Arrays.asList(userMessage))
                .resultFormat(GenerationParam.ResultFormat.MESSAGE)
                .build();
        try {
            return gen.call(param);
        } catch (NoApiKeyException | InputRequiredException e) {
            throw new RuntimeException(e);
        }
    }


}
