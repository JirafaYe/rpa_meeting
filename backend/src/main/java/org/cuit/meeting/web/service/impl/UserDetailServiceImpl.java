package org.cuit.meeting.web.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.extern.slf4j.Slf4j;
import org.cuit.meeting.dao.UserMapper;
import org.cuit.meeting.domain.LoginUser;
import org.cuit.meeting.domain.entity.User;
import org.cuit.meeting.utils.AuthenticationContextHolder;
import org.cuit.meeting.utils.SecurityUtils;
import org.cuit.meeting.web.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Objects;

/**
 * @author Devildyw
 * @date 2025/03/23 19:08
 **/
@Slf4j
@Service
public class UserDetailServiceImpl implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    public void validate(User user)
    {
        Authentication usernamePasswordAuthenticationToken = AuthenticationContextHolder.getContext();
        String password = usernamePasswordAuthenticationToken.getCredentials().toString();

        if (!matches(user, password))
        {
            throw new RuntimeException("密码错误");
        }
    }

    public boolean matches(User user, String rawPassword)
    {
        return SecurityUtils.matchesPassword(rawPassword, user.getPassword());
    }

    public UserDetails createLoginUser(User user)
    {
        //todo 补全权限
//        permissionService.getMenuPermission(user)
        HashSet<String> set = new HashSet<String>();
        set.add("1");
        return new LoginUser(user.getId(), user.getUsername(), user, set);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));
        if (Objects.isNull(user))
        {
            log.info("登录用户：{} 不存在.", username);
            throw new RuntimeException("用户不存在");
        }
        else if (user.getIsActive().equals(1))
        {
            log.info("登录用户：{} 已被禁用.", username);
            throw new RuntimeException("用户已被禁用");
        }

        this.validate(user);

        return createLoginUser(user);
    }
}