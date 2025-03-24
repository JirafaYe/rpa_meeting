package org.cuit.meeting.web.controller;

import com.alibaba.fastjson2.JSON;
import org.cuit.meeting.domain.CompletionResponse;
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
        CompletionResponse completion = openAIClient.getCompletion(prompt);
        return JSON.toJSONString(completion);
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