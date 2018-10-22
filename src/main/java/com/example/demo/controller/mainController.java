package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Title: MainController.java
 * @Package com.example.demo.controller.security
 * @Description: TODO(用一句话描述该文件做什么)
 * @author gzx
 * @date 2018年8月23日11:49:31
 * @version V1.0
 */
@Controller
@RequestMapping("/main")
public class mainController {
    /**
     * 主页
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping
    public String execute(HttpServletRequest request, HttpServletResponse response){
        System.out.println("==========================");
        System.out.println("显示主页");
        System.out.println("==========================");
        return "home";
    }

    @RequestMapping("login")
    public String showLogin(HttpServletRequest request){
        System.out.println("==========================");
        System.out.println("显示登录页");
        System.out.println("==========================");
        return "login";
    }
    @RequestMapping("console")
    public String showConsole(HttpServletRequest request){
        System.out.println("==========================");
        System.out.println("显示控制台");
        System.out.println("==========================");
        return "console";
    }

    @RequestMapping("page1")
    public String personnelManage(HttpServletRequest request){
        System.out.println("==========================");
        System.out.println("显示页面1");
        System.out.println("==========================");
        return "page1";
    }

}
