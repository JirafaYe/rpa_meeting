package org.cuit.meeting.web.controller;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.lang.UUID;
import com.alibaba.druid.util.StringUtils;
import com.google.code.kaptcha.Producer;
import org.cuit.meeting.config.CacheConstants;
import org.cuit.meeting.config.Constants;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.domain.request.LoginBody;
import org.cuit.meeting.domain.request.RegisterBody;
import org.cuit.meeting.utils.RedisCache;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FastByteArrayOutputStream;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import static org.cuit.meeting.domain.AjaxResult.error;
import static org.cuit.meeting.domain.AjaxResult.success;

/**
 * 
 * @author Devildyw
 * @date 2025/03/16 22:03
 **/
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource(name = "captchaProducer")
    private Producer captchaProducer;

    @Autowired
    private RedisCache redisCache;

    @Autowired
    private UserService userService;

    /**
     * 生成验证码
     */

    @GetMapping("/captchaImage")
    public AjaxResult getCode() throws IOException
    {
        AjaxResult ajax = success();

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
            return error(e.getMessage());
        }

        ajax.put("uuid", uuid);
        ajax.put("img", Base64.encode(os.toByteArray()));
        return ajax;
    }

    @PostMapping("/login")
    public AjaxResult login(@RequestBody LoginBody loginBody)
    {
        AjaxResult ajax = AjaxResult.success();
        // 生成令牌
        String token = userService.login(loginBody.getUsername(), loginBody.getPassword(), loginBody.getCode(),
                loginBody.getUuid());
        ajax.put(Constants.TOKEN, token);
        return ajax;
    }

    @PostMapping("/register")
    public AjaxResult register(@RequestBody RegisterBody user)
    {
        String msg = userService.register(user);
        return StringUtils.isEmpty(msg) ? success() : error(msg);
    }

    @GetMapping("/captcha")
    public void captcha() {
        System.out.println("captcha");
    }



}
