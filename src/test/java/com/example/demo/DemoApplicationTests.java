package com.example.demo;

import com.example.demo.entity.AyUser;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {
    @Resource
    private JdbcTemplate jdbcTemplate;

    @Test
    public void contextLoads() {
    }

    @Test
    public void mySqlTest(){
        String sql = "select id,name,password from ay_user";
        List<AyUser> userList = (List<AyUser>) jdbcTemplate.query(sql, new RowMapper<AyUser>() {
            @Override
            public AyUser mapRow(ResultSet rs,int rowNum) throws SQLException{
                AyUser user = new AyUser();
                user.setId(rs.getString("id"));
                user.setName(rs.getString("name"));
                user.setPassword(rs.getString("password"));
                return user;
            }
        });
        System.out.println("查询成功！");
        for(AyUser user : userList){
            System.out.println("[id]:"+user.getId()+",[name]："+user.getName()+",[password]:"+user.getPassword());
        }
    }

}
