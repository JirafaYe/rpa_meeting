package org.cuit.meeting.domain;

import lombok.Data;

import java.util.List;
@Data
public class CompletionResponse {
    private List<Choice> choices;
    private Usage usage;
    private long created;
    private String object;
    private String model;
    private String id;
    @Data
    // 嵌套静态类
    public static class Choice {
        private Message message;
        private String finish_reason;
        private int index;
        private Object logprobs;
    }
    @Data
    public static class Message {
        private String content;
        private String role;
    }

    @Data
    public static class Usage {
        private int prompt_tokens;
        private int completion_tokens;
        private int total_tokens;
    }

}