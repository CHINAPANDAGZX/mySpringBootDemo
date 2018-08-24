package com.example.demo.entity;

/**
 * 描述：用户表
 * 作者：gzx
 * 日期：2018年8月24日09:55:01
 */
public class AyUser {
    //主键
    private String id;
    //用户名
    private String name;
    //密码
    private String password;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
