package org.cuit.meeting.web.service.impl;

import com.alibaba.druid.util.StringUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import lombok.extern.slf4j.Slf4j;
import org.cuit.meeting.config.CacheConstants;
import org.cuit.meeting.config.Constants;
import org.cuit.meeting.constant.UserConstants;
import org.cuit.meeting.dao.UserMapper;
import org.cuit.meeting.domain.LoginUser;
import org.cuit.meeting.domain.entity.User;
import org.cuit.meeting.domain.request.RegisterBody;
import org.cuit.meeting.utils.AuthenticationContextHolder;
import org.cuit.meeting.utils.RedisCache;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.TokenService;
import org.cuit.meeting.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
* @author 18425
* @description 针对表【user(用户基本信息表)】的数据库操作Service实现
* @createDate 2025-03-16 21:56:32
*/
@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService {

    @Autowired
    private RedisCache redisCache;

    @Autowired
    private TokenService tokenService;

    @Resource
    private AuthenticationManager authenticationManager;

    @Override
    public String register(RegisterBody registerBody) {
        String msg = "", username = registerBody.getUsername(), password = registerBody.getPassword();
        User user = new User();
        user.setUsername(username);

        // 验证码开关 todo 开发阶段注册不需要验证码
//        validateCaptcha(registerBody.getCode(), registerBody.getUuid());

        if (StringUtils.isEmpty(username))
        {
            msg = "用户名不能为空";
        }
        else if (StringUtils.isEmpty(password))
        {
            msg = "用户密码不能为空";
        }
        else if (username.length() < UserConstants.USERNAME_MIN_LENGTH
                || username.length() > UserConstants.USERNAME_MAX_LENGTH)
        {
            msg = "账户长度必须在2到20个字符之间";
        }
        else if (password.length() < UserConstants.PASSWORD_MIN_LENGTH
                || password.length() > UserConstants.PASSWORD_MAX_LENGTH)
        {
            msg = "密码长度必须在5到20个字符之间";
        }
        else if (!this.checkUserNameUnique(user))
        {
            msg = "保存用户'" + username + "'失败，注册账号已存在";
        }
        else
        {
            user.setPassword(SecurityUtils.encryptPassword(password));
            // 设置默认头像
            user.setAvatarUrl("https://ding-blog.oss-cn-chengdu.aliyuncs.com/images/%E7%94%A8%E6%88%B7.png");
            // 默认有效
            user.setIsActive(0);
            user.setCreateTime(new Date());
            user.setUpdateTime(new Date());
            boolean regFlag = this.registerUser(user);
            if (!regFlag)
            {
                msg = "注册失败,请联系系统管理人员";
            }
        }
        return msg;
    }

    @Override
    public String login(String username, String password, String code, String uuid) {
        // 验证码校验 开发环境暂时不用验证码
//        validateCaptcha(code, uuid);
        // 登录前置校验
        loginPreCheck(username, password);
        // 用户验证
        Authentication authentication = null;
        try
        {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
            AuthenticationContextHolder.setContext(authenticationToken);
            // 该方法会去调用UserDetailsServiceImpl.loadUserByUsername
            authentication = authenticationManager.authenticate(authenticationToken);
        }
        catch (Exception e)
        {
            e.printStackTrace();
//            if (e instanceof BadCredentialsException)
//            {
//                throw new RuntimeException("密码错误");
//            }
        }
        finally
        {
            AuthenticationContextHolder.clearContext();
        }
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        // 生成token
        return tokenService.createToken(loginUser);
    }

    /**
     * 登录前置校验
     * @param username 用户名
     * @param password 用户密码
     */
    public void loginPreCheck(String username, String password)
    {
        // 用户名或密码为空 错误
        if (StringUtils.isEmpty(username) || StringUtils.isEmpty(password))
        {
            throw new RuntimeException("用户名或密码为空");
        }
        // 密码如果不在指定范围内 错误
        if (password.length() < UserConstants.PASSWORD_MIN_LENGTH
                || password.length() > UserConstants.PASSWORD_MAX_LENGTH)
        {
            throw new RuntimeException("密码如果不在指定范围内");
        }
        // 用户名不在指定范围内 错误
        if (username.length() < UserConstants.USERNAME_MIN_LENGTH
                || username.length() > UserConstants.USERNAME_MAX_LENGTH)
        {
            throw new RuntimeException("用户名不在指定范围内");
        }
    }

    private boolean registerUser(User user) {
        return this.save(user);
    }

    private boolean checkUserNameUnique(User user) {
        Integer userId = Objects.isNull(user.getId()) ? -1 : user.getId();
        User info = this.getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, user.getUsername()).last("limit 1"));;
        if (Objects.nonNull(info) && info.getId().equals(userId))
        {
            return UserConstants.NOT_UNIQUE;
        }
        return UserConstants.UNIQUE;
    }


    /**
     * 校验验证码
     *
     * @param code 验证码
     * @param uuid 唯一标识
     * @return 结果
     */
    public void validateCaptcha(String code, String uuid)
    {
        uuid = StringUtils.isEmpty(uuid) ? "" : uuid;
        String verifyKey = CacheConstants.CAPTCHA_CODE_KEY + uuid;
        String captcha = redisCache.getCacheObject(verifyKey);
        redisCache.deleteObject(verifyKey);
        if (captcha == null)
        {
            throw new RuntimeException("验证码为空");
        }
        if (!code.equalsIgnoreCase(captcha))
        {
            throw new RuntimeException("验证码错误");
        }
    }

}




