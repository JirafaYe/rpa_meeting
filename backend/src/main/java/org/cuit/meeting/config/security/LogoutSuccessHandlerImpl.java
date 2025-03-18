package org.cuit.meeting.config.security;

import com.alibaba.fastjson2.JSON;
import org.cuit.meeting.config.Constants;
import org.cuit.meeting.domain.AjaxResult;
import org.cuit.meeting.domain.LoginUser;
import org.cuit.meeting.utils.ServletUtils;
import org.cuit.meeting.web.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Objects;

@Configuration
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler
{
    @Autowired
    private TokenService tokenService;

    /**
     * 退出处理
     * 
     * @return
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws ServletException
    {
        LoginUser loginUser = tokenService.getLoginUser(request);
        if (Objects.nonNull(loginUser))
        {
            String userName = loginUser.getUsername();
            // 删除用户缓存记录
            tokenService.delLoginUser(loginUser.getToken());
        }
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.success("user.logout.success")));
    }
}
