package org.cuit.meeting.web.service;

import io.minio.*;
import io.minio.errors.*;
import lombok.extern.slf4j.Slf4j;
import org.cuit.meeting.config.minio.MinioProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

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
     * @return
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
            ObjectWriteResponse objectWriteResponse = minioClient
                    .putObject(PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(fileName)
                            .stream(inputStream, -1, -1)
                            .build());

        } catch (MinioException e) {
            System.out.println("Error occurred: " + e);
            System.out.println("HTTP trace: " + e.httpTrace());
        }
        return getFileUrl(fileName);
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

    private String getFileUrl(String fileName) {
        return minioProperties.getBucket() + "/" + minioProperties.getBucket() + "/" + fileName;
    }

}