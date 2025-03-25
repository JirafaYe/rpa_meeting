package org.cuit.meeting.utils;

import com.alibaba.dashscope.aigc.generation.Generation;
import com.alibaba.dashscope.aigc.generation.GenerationParam;
import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversation;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationParam;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationResult;
import com.alibaba.dashscope.common.GeneralGetParam;
import com.alibaba.dashscope.common.Message;
import com.alibaba.dashscope.common.MultiModalMessage;
import com.alibaba.dashscope.common.Role;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;
import com.alibaba.dashscope.exception.UploadFileException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;

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

    private static final String LLModel = "deepseek-v3";

    private static final String AudioModel = "qwen-audio-turbo-latest";

    public GenerationResult getCompletion(String prompt)  {
        Generation gen = new Generation();
        Message userMessage = Message.builder()
                .role(Role.USER.getValue())
                .content(prompt)
                .build();
        GenerationParam param = GenerationParam.builder()
                .apiKey(apiKey)
                .model(LLModel)
                //这个参数控制生成文本的随机性。值越高（如1.0），生成的文本越随机；
                .temperature(0.5F)
                //这个参数控制生成文本的多样性。值越高（如1.0），生成的文本越多样化；
                .topP(0.8D)
                //是另一种控制生成文本随机性的参数。它限制了模型在每一步生成时只考虑概率最高的前K个词。
                .topK(40)
                //这个参数用于控制生成文本中某些词的出现频率。值越高，模型越倾向于避免重复使用相同的词。
                .repetitionPenalty(0.5F)
                .messages(Collections.singletonList(userMessage))
                .resultFormat(GenerationParam.ResultFormat.MESSAGE)
                .build();
        try {
            return gen.call(param);
        } catch (NoApiKeyException | InputRequiredException e) {
            throw new RuntimeException(e);
        }
    }

    public MultiModalConversationResult analysisAudio(String fileUrl) {
        MultiModalConversation conv = new MultiModalConversation();
        MultiModalMessage userMessage = MultiModalMessage.builder()
                .role(Role.USER.getValue())
                .content(Arrays.asList(
                        Collections.singletonMap("audio", fileUrl),
                        Collections.singletonMap("text", "这段音频在说什么? 请直接输出内容，最好附带标点符号")))
                .build();

        MultiModalConversationParam param = MultiModalConversationParam.builder()
                .model(AudioModel)
                .message(userMessage)
                .apiKey(apiKey)
                .build();
        try {
            return conv.call(param);
        } catch (NoApiKeyException | UploadFileException e) {
            throw new RuntimeException(e);
        }
    }


}
