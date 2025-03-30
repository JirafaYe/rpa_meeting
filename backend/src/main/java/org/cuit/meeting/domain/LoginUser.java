package org.cuit.meeting.domain;

import com.alibaba.fastjson2.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.cuit.meeting.domain.entity.Role;
import org.cuit.meeting.domain.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;

/**
 * @author Devildyw
 * @date 2025/03/17 23:00
 **/
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true, value = {"password"})
public class LoginUser implements UserDetails {
    private String token;

    private Long expireTime;

    private Long loginTime;

    private User user;

    private String username;

    private Integer id;

    private List<Role> roles;

    public LoginUser(Integer id, String username, User user, List<Role> roles) {
        this.user = user;
        this.roles = roles;
        this.id = id;
        this.username = username;
    }

    @Override
    @JSONField(serialize = false)
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {

        return user.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}