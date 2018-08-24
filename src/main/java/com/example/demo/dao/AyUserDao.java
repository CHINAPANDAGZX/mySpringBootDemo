package com.example.demo.dao;

import com.example.demo.entity.AyUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 描述：用户表Dao
 * 作者：gzx
 * 时间：2018年8月24日16:02:14
 */
@Mapper
public interface AyUserDao {
    /**
     * 描述：通过用户名和密码查询用户
     * @param name
     * @param password
     */
    AyUser findByNameAndPassword(@Param("name") String name,@Param("password") String password);
}
