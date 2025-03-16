package org.cuit.meeting.web.controller;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.lang.UUID;
import com.google.code.kaptcha.Producer;
import org.cuit.meeting.config.CacheConstants;
import org.cuit.meeting.config.Constants;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.utils.RedisCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FastByteArrayOutputStream;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * 
 * @author Devildyw
 * @date 2025/03/16 22:03
 **/
@RestController("/user")
public class UserController {

    @Resource(name = "captchaProducer")
    private Producer captchaProducer;

    @Resource(name = "captchaProducerMath")
    private Producer captchaProducerMath;

    @Autowired
    private RedisCache redisCache;

    /**
     * 生成验证码
     */
    @GetMapping("/captchaImage")
    public AjaxResult getCode(HttpServletResponse response) throws IOException
    {
        AjaxResult ajax = AjaxResult.success();

        // 保存验证码信息
        String uuid = UUID.fastUUID().toString();
        String verifyKey = CacheConstants.CAPTCHA_CODE_KEY + uuid;

        String capStr = null, code = null;
        BufferedImage image = null;

        // 生成验证码
        capStr = code = captchaProducer.createText();
        image = captchaProducer.createImage(capStr);


        redisCache.setCacheObject(verifyKey, code, Constants.CAPTCHA_EXPIRATION, TimeUnit.MINUTES);
        // 转换流信息写出
        FastByteArrayOutputStream os = new FastByteArrayOutputStream();
        try
        {
            ImageIO.write(image, "jpg", os);
        }
        catch (IOException e)
        {
            return AjaxResult.error(e.getMessage());
        }

        ajax.put("uuid", uuid);
        ajax.put("img", Base64.encode(os.toByteArray()));
        return ajax;
    }

    @PostMapping("/login")
    public void login() {
        System.out.println("login");
    }

    @PostMapping("/register")
    public void register() {
        System.out.println("register");
    }

    @PostMapping("/logout")
    public void logout() {
        System.out.println("logout");
    }

    @GetMapping("/captcha")
    public void captcha() {
        System.out.println("captcha");
    }



}
