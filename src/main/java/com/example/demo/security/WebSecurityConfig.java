package com.example.demo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

//--------------------------------------//
//描述：security配置类
//作者：GZX
//时间：2018年9月28日14:11:01
//版本：V1.O
//--------------------------------------//
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected  void configure (HttpSecurity http) throws Exception{
        //路由策略和访问权限的简单配置
        http
                .formLogin()                      //启用默认登陆页面
                .failureUrl("/main/page1")     //登陆失败返回URL:/login?error
                .defaultSuccessUrl("/main")  //登陆成功跳转URL，这里调整到用户首页
                .permitAll();                    //登陆页面全部权限可访问
        super.configure(http);
    }
    /**
     * 配置内存用户
     */
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
            .withUser("GZX").password("123456").roles("ADMIN")
            .and()
            .withUser("GZB").password("123456").roles("USER");
    }
}
