package org.cuit.meeting.web.controller;

import com.alibaba.dashscope.aigc.generation.GenerationResult;
import com.alibaba.dashscope.aigc.multimodalconversation.MultiModalConversationResult;
import com.alibaba.fastjson2.JSON;
import org.cuit.meeting.utils.OpenAPIUtil;
import org.cuit.meeting.web.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

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
        GenerationResult completion = openAIClient.getCompletion(prompt);
        String content = completion.getOutput().getChoices().get(0).getMessage().getContent();
        return content;
    }

    @RequestMapping("/testAudio")
    public String testAudio(@RequestParam String fileName, @RequestParam MultipartFile file) {
//        GenerationResult completion = openAIClient.getCompletion(prompt);
        String filename = "";
        MultiModalConversationResult multiModalConversationResult = null;
        try {
            filename = fileService.uploadFile(file.getOriginalFilename(), file.getInputStream());
            String fileUrl = fileService.getPresignedObjectUrl(filename);
            multiModalConversationResult = openAIClient.analysisAudio(fileUrl);

        } catch (Exception e) {
            System.out.println(e);
        }
        return JSON.toJSONString(multiModalConversationResult);
    }

    @Autowired
    private FileService  fileService;
    @RequestMapping("/upload")
    public String upload(String fileName, MultipartFile file) throws IOException {
        String url = "";
        try {
            url = fileService.uploadFile(file.getOriginalFilename(), file.getInputStream());
        } catch (Exception e) {
            System.out.println(e);
        }
        return url;
    }

    @RequestMapping("/getUrl")
    public String upload(String fileName) throws IOException {
        String url = "";
        try {
            url = fileService.getPresignedObjectUrl(fileName);
        } catch (Exception e) {
            System.out.println(e);
        }
        return url;
    }

    @RequestMapping("/downLoadFile")
    public void downLoadFile(String fileName, HttpServletResponse response) {
        try {
            fileService.downloadFile(fileName, response);
        } catch (IOException | NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }

}