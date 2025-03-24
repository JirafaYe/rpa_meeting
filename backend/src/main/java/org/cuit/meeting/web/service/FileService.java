package org.cuit.meeting.web.service;

import io.minio.*;
import io.minio.errors.*;
import io.minio.http.Method;
import lombok.extern.slf4j.Slf4j;
import org.cuit.meeting.config.minio.MinioProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

/**
 * 对mino进行封装
 * @author Devildyw
 * @date 2025/03/23 22:49
 **/
@Slf4j
@Service
public class FileService {
    @Autowired
    private MinioProperties minioProperties;

    @Autowired
    private MinioClient minioClient;

    /**
     * 上传文件通过文件流方式
     * @param fileName 文件名
     * @param inputStream 文件流
     * @return 文件名 fileKey
     * @throws IOException 文件流异常
     * @throws NoSuchAlgorithmException 算法异常
     * @throws InvalidKeyException key异常
     */
    public String uploadFile(String fileName, InputStream inputStream)
            throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            //校验bucket是否存在
            String bucket = this.getBucketName();
            bucketExists(bucket);
//            fileName = getFileName(fileName);
            minioClient
                    .putObject(PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .stream(inputStream, inputStream.available(), -1)
                            .build());
        } catch (MinioException e) {
            System.out.println("Error occurred: " + e);
            System.out.println("HTTP trace: " + e.httpTrace());
        }
        return fileName;
    }

//    private String getFileName(String fileName) {
//        String[] split = fileName.split("\\.");
//        return split[0] + "_" + System.currentTimeMillis() + "." + split[1];
//    }

    /**
     * 生成预签名的文件URL
     * @param fileName 文件名 bucket中存储的文件名
     * @return
     * @throws IOException
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeyException
     */
    public String getPresignedObjectUrl(String fileName)
            throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        String url = "";
        try {
            String bucket = this.getBucketName();
            url = minioClient.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(bucket)
                    .object(fileName)
                    .expiry(7, TimeUnit.DAYS)
                    .build());
        } catch (MinioException e) {
            System.out.println("Error occurred: " + e);
            System.out.println("HTTP trace: " + e.httpTrace());
        }
        return url;
    }

    /**
     * 客户端下载文件
     * @param fileName 文件名
     * @param response 响应
     * @throws IOException 文件流异常
     * @throws NoSuchAlgorithmException 算法异常
     * @throws InvalidKeyException key异常
     */
    public void downloadFile(String fileName, HttpServletResponse response)
            throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        try {
            String bucket = this.getBucketName();
            GetObjectResponse inputStream = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(fileName)
                    .build());
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            int len;
            byte[] bytes = new byte[1024];
            while ((len = inputStream.read(bytes)) != -1) {
                byteArrayOutputStream.write(bytes, 0, len);
            }
            inputStream.close();
            byteArrayOutputStream.close();
            fileName = URLEncoder.encode(fileName, "UTF-8")
                    .replace("+", "%20");
            response.setHeader("Content-Disposition", "attachment; filename*=UTF-8''" + fileName);
            byteArrayOutputStream.writeTo(response.getOutputStream());
        } catch (MinioException e) {
            System.out.println("Error occurred: " + e);
            System.out.println("HTTP trace: " + e.httpTrace());
        }
    }

    /**
     * 删除文件
     * @param fileName 文件名
     * @return 是否删除成功
     * @throws IOException 文件流异常
     * @throws NoSuchAlgorithmException 算法异常
     * @throws InvalidKeyException key异常
     */
    public boolean removeFile(String fileName) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
        boolean result = true;
        try {
            String bucket = this.getBucketName();
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(fileName)
                    .build());
        } catch (MinioException e) {
            result = false;
            System.out.println("Error occurred: " + e);
            System.out.println("HTTP trace: " + e.httpTrace());
        }
        return result;
    }

    private void bucketExists(String bucketName) throws MinioException, IOException, NoSuchAlgorithmException, InvalidKeyException {
        // 判断bucket是否存在
        boolean bucketExists = minioClient.bucketExists(BucketExistsArgs
                .builder().bucket(bucketName).build());
        if (!bucketExists) {
            //不存在创建bucket
            minioClient.makeBucket(MakeBucketArgs
                    .builder().bucket(bucketName).build());
        } else {
            log.info("Bucket already exists");
        }
    }

    private String getBucketName() {
        return minioProperties.getBucket();
    }

    private String getPrefix(String fileName) {
        return minioProperties.getBucket() + "/" + minioProperties.getBucket() + "/" + fileName;
    }



}