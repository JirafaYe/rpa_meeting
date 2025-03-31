package org.cuit.meeting.web.controller;

import cn.hutool.core.codec.Base64;
import cn.hutool.core.lang.UUID;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.google.code.kaptcha.Producer;
import org.apache.commons.lang3.StringUtils;
import org.cuit.meeting.config.CacheConstants;
import org.cuit.meeting.config.Constants;
import org.cuit.meeting.domain.LoginUser;
import org.cuit.meeting.domain.Result;
import org.cuit.meeting.domain.dto.PageDTO;
import org.cuit.meeting.domain.entity.User;
import org.cuit.meeting.domain.request.*;
import org.cuit.meeting.utils.RedisCache;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.FastByteArrayOutputStream;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import static org.cuit.meeting.domain.AjaxResult.error;
import static org.cuit.meeting.domain.AjaxResult.success;

/**
 * 用户通用
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
    public Result<Object> getCode() throws IOException
    {
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
            return Result.fail(e.getMessage());
        }
        HashMap<String, String> map = new HashMap<>();
        map.put("uuid", uuid);
        map.put("img", Base64.encode(os.toByteArray()));
        return Result.ok(map);
    }

    /**
     * 登录
     * @param loginBody
     * @return
     */
    @PostMapping("/login")
    public Result<Object> login(@RequestBody LoginBody loginBody)
    {
        // 生成令牌
        String token = userService.login(loginBody.getUsername(), loginBody.getPassword(), loginBody.getCode(),
                loginBody.getUuid());
        Map<String, String> map = new HashMap<>();
        map.put("token", token);
        return Result.ok(map);
    }

    /**
     * 注册
     * @param user
     * @return
     */
    @PostMapping("/register")
    public Result<Object> register(@RequestBody RegisterBody user)
    {
        String msg = userService.register(user);
        return StringUtils.isBlank(msg) ? Result.ok() : Result.fail(msg);
    }

    /**
     * 获取登录用户信息
     * @return 用户信息
     */
    @GetMapping("/info")
    public Result<LoginUser> getInfo(){
        return Result.ok(SecurityUtils.getLoginUser());
    }

    /**
     * 更新用户信息
     * @param body 用户信息
     * @return 结果
     */
    @PutMapping("info")
    public Result<Object> update(@RequestBody UserBody body){
        Integer id = body.getId();
        if (id == null) {
            return Result.fail("用户id不能为空");
        }

        User user = userService.getById(id);
        if (user == null) {
            return Result.fail("用户不存在");
        }

        // 如果是更新用户名
        if (StringUtils.isNotBlank(body.getUsername())) {
            if (!body.getUsername().equals(user.getUsername())) {
                if (userService.getBaseMapper().selectCount(new LambdaQueryWrapper<User>().eq(User::getUsername, body.getUsername())) > 0) {
                    return Result.fail("用户名已存在");
                }
            }
            user.setUsername(body.getUsername());
        }

        // 如果是更新头像
        if (StringUtils.isNotBlank(body.getAvatarUrl())) {
            user.setAvatarUrl(body.getAvatarUrl());
        }

        // 如果是更新状态
        if (Objects.nonNull(body.getIsActive())) {
            user.setIsActive(body.getIsActive());
        }

        boolean success = userService.updateById(user);
        if (!success) {
            return Result.fail("更新失败");
        }
        SecurityUtils.setUser(userService.getById(body.getId()));
        return Result.ok();
    }

    /**
     * 更新密码
     * @param body 密码信息
     * @return
     */
    @PutMapping("/password")
    public Result<Object> updatePassword(@RequestBody PasswordBody body){
        return userService.updatePassword(body);
    }

    /**
     * 分页查询用户，支持模糊查询名字
     * @return
     */
    @GetMapping()
    public Result<PageDTO<UserBody>> pageUsers(UserPageQuery query){
        return Result.ok(userService.pageUsers(query));
    }
}
