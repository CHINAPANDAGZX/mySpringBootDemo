-- -------------------------------------------
-- 用户表
-- Table structure for ay_user
-- -------------------------------------------
DROP TABLE IF EXISTS ay_user;
CREATE TABLE ay_user(
  id varchar(32) not null primary key,
  name varchar(10),
  password varchar(32)
);

-- ====================================================
-- ===================插入数据部分======================
-- ====================================================
INSERT INTO ay_user (id,name,password) VALUES ("1","小明","123456");
INSERT INTO ay_user (id,name,password) VALUES ("2","小樱","123456");