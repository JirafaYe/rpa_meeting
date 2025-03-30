package org.cuit.meeting.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.FileDto;
import org.cuit.meeting.web.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

/**
 * 文件操作
 * @author Devildyw
 * @date 2025/03/29 13:42
 **/
@Slf4j
@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileService fileService;

    /**
     * 获取文件url
     * @param fileKey
     * @return
     */
    @GetMapping("/url")
    public Result<Object> getUrl(@RequestParam String fileKey){
        String presignedObjectUrl = "";
        try {
            presignedObjectUrl = fileService.getPresignedObjectUrl(fileKey);
        } catch (Exception e){
            log.error(e.getMessage());
            return Result.fail("获取文件url失败");
        }
        HashMap<String, String> result = new HashMap<>();
        result.put("url", presignedObjectUrl);
        return Result.ok(result);
    }

    /**
     * 下载文件
     * @param fileKey
     * @return
     */
    @GetMapping("/download")
    public void downloadFile(@RequestParam String fileKey, HttpServletResponse response){
        try {
            fileService.downloadFile(fileKey, response);
        } catch (Exception e){
            log.error("下载文件失败，原因：{}",e.getMessage());
        }
    }

    /**
     * 上传文件
     * @param file
     * @return 文件key
     */
    @PostMapping("/upload")
    public Result<FileDto> uploadFile(@RequestParam("file") MultipartFile file){
        FileDto fileDto = null;
        try {
            fileDto = fileService.uploadFile(file.getOriginalFilename(), file.getInputStream());
        } catch (Exception e){
            log.error("上传文件失败，原因：{}",e.getMessage());
            return Result.fail("上传文件失败");
        }
        HashMap<String, String> result = new HashMap<>();
        return Result.ok(fileDto);
    }
}