package org.cuit.meeting.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * @author Devildyw
 * @date 2025/03/16 22:03
 **/
@RestController("/user")
public class UserController {

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
