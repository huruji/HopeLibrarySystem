#创建数据库
CREATE DATABASE mytest DEFAULT CHARACTER SET 'utf8';

USE mytest;

#创建学员表
--编号id
--用户名username
--年龄age
--性别sex
--邮箱addr
--生日birth
--薪水salary
--电话tel
--是否结婚married
--当需要输入中文时，需要临时转换客户端编码方式
--
CREATE TABLE `user`(
id SMALLINT,
username VARCHAR(20),
age TINYINT,
sex ENUM('男','女','保密'),
email VARCHAR(50),
addr VARCHAR(200),
birth YEAR,
salary FLOAT(8,2),
married TINYINT(1) COMMENT '0代表结婚'
)ENGINE=INNODB CHARSET=UTF8;


--创建课程表course
--编号cid
--课程名称courseName
--课程描述courseDesc
CREATE TABLE course(
	cid TINYINT,
	courseName VARCHAR(50),
	courseDesc VARCHAR(300)
)

--创建新闻表cms_cate
--编号id
--分类名称className
--分类描述classDis
CREATE TABLE `cms_cate`(
	mid TINYINT,
	className VARCHAR(50),
	classDis VARCHAR(200)
);

--创建新闻表cms_news
--编号id
--新闻标题title
--新闻内容content
--新闻发布时间newstime
--点击量click
--是否置顶top
--新闻所属分类class
--发布人author
CREATE TABLE `cms_news`(
	sid TINYINT,
	title VARCHAR(50),
	content LONGTEXT,
	newstime DATETIME,
	click SMALLINT,
	top TINYINT(1) COMMENT '1代表置顶',
	class VARCHAR(50),
	author VARCHAR(20)
)

--查看cms-news的表结构
DESC cms_news;
DESCRIBE cms_news;
SHOW COLUMNS FROM cms_news;

--测试整型
CREATE TABLE testint(
	num1 TINYINT,
	num2 SMALLINT,
	num3 MEDIUMINT,
	num4 INT,
	num5 BIGINT
)
--向表中插入记录
INSERT testint VALUES(-128,-32768,-8388608,-2147483648,-9223372036854775808);
--查询表中所有记录 SELECT * FOROM tab_name
SELECT *FROM testint;

--无符号的UNSIGNED
CREATE TABLE testunsigned(
num1 TINYINT UNSIGNED,
num2 SMALLINT UNSIGNED,
num3 MEDIUMINT UNSIGNED,
num4 INT UNSIGNED,
num5 BIGINT UNSIGNED
);
--插入记录
INSERT testunsigned VALUES(244,233,222,111,244);
--查询表中所有的结构
SELECT * FROM testunsigned;


--0填充试验
CREATE TABLE testzero(
num1 TINYINT(3) ZEROFILL,
num2 TINYINT
);
--插入数据
INSERT testzero VALUES(2,2);
--显示记录
SELECT * FROM testzero;


--测试浮点数
--创建表
CREATE TABLE testfloat(
num1 FLOAT(6,2),
num2 DOUBLE(6,2),
num3 DECIMAL(6,2)
);
--查看表结构
DESC testfloat;
--增加数据
INSERT testfloat VALUES(3.1415,3.1415,3.1415);
--查看记录
SELECT * FROM testfloat;
--再次增加数据
INSERT testfloat VALUES(3.2489,3.2489,3.2489);
--查看记录
SELECT * FROM testfloat;
--按条件查看记录
SELECT * FROM testfloat WHERE num1=3.14;
--测试char
CREATE TABLE testchar(
str1 CHAR(5),
str2 VARCHAR(5)
);
DESC testchar;
INSERT testchar VALUES(1,2);
SELECT * FROM testchar;
INSERT testchar VALUES(1,111111);
INSERT testchar VALUES(" "," ");
INSERT testchar VALUES(" , "," , ");
SELECT CONCAT(str1,'-'),CONCAT(str2,'+') FROM testchar;
INSERT testchar VALUES('啊','哦');
SELECT LENGTH('哈');
SELECT CHAR_LENGTH('哈');

--测试text
CREATE TABLE testtext(
	text1 Text
);
DESC testtext;
INSERT testtext VALUES('我shiu偶偶偶iuIOUII哦');
SELECT * FROM testtext;
 --测试枚举类型
CREATE TABLE testenum(
sexnum ENUM('男','女','保密')
);
INSERT testenum VALUES('男');
SELECT *　FROM testenum;
--测试set
CREATE TABLE  testset(
fav SET('a','b','c','d')
);
DESC testset;
INSERT testset VALUES('a,c,d');
INSERT testset VALUES('c,d,a');
INSERT testset VALUES(3);
INSERT testset VALUES(15);
SELECT * FROM testset;
--测试year
CREATE TABLE testyear(
birth YEAR
);
INSERT testyear VALUES(1902);
SELECT * FROM testyear;

--测试日期时间
CREATE TABLE testtime(
test TIME
);
INSERT testtime VALUES("1 12:12:12");
SELECT * FROM testtime;
INSERT testtime VALUES("11:11");
INSERT testtime VALUES('1212');
INSERT testtime VALUES('12');
SELECT * FROM testtime;

--测试date
CREATE TABLE testdate(
test DATE
);
INSERT testdate VALUES('12-6-7');
SELECT * FROM testdate;


--测试主键
CREATE TABLE testkey(
id INT PRIMARY KEY,
username VARCHAR(20)
);
DESC testkey;

--查看创建表的定义
SHOW CREATE TABLE testkey;
INSERT testkey VALUES(1,'KING');
SELECT * FROM testkey;
INSERT testkey VALUES(1,'huruji');
INSERT testkey VALUES(12,'KING');
SELECT * FROM testkey WHERE id=1;


CREATE TABLE testmanykey(
id INT,
username VARCHAR(20),
card CHAR(18),
PRIMARY KEY(id,card)
);
DESC testmanykey;
INSERT testmanykey VALUES(1,'huruji','111');
SELECT * FROM testmanykey;
INSERT testmanykey VALUES(2,'huruji ','111');
SELECT * FROM testmanykey;

CREATE TABLE testotherkey(
id INT KEY,
user VARCHAR(20)
);
SHOW CREATE TABLE testotherkey;

--测试auto_increment
CREATE TABLE testauto(
id SMALLINT KEY AUTO_INCREMENT,
username VARCHAR(20)
);

DESC testauto;

INSERT testauto VALUES(1,'king');
SELECT * FROM testauto;
INSERT testauto(username) VALUES('hurji');
SELECT * FROM testauto;
INSERT testauto VALUES(111,'KING');
INSERT testauto(username) VALUES('HURUJI');
SHOW CREATE TABLE testauto;
INSERT testauto VALUES(3,'XIE');
SHOW CREATE TABLE testauto;

INSERT testauto VALUES(NULL, 'ZHI');
SELECT * FROM testauto;
INSERT testauto VALUES(DEFAULT, 'QIANG');
SELECT * FROM testauto;

CREATE TABLE testauto2(
id INT KEY AUTO_INCREMENT,
username VARCHAR(20)
)AUTO_INCREMENT=100;
SHOW CREATE TABLE testauto2;
INSERT testauto2 VALUES(DEFAULT,'hhhhh');
SELECT * FROM testauto2;



--测试not null
CREATE TABLE testnull(
id INT UNSIGNED KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL,
password CHAR(32) NOT NULL,
age TINYINT UNSIGNED
);
DESC testnull;

INSERT testnull(username,password) VALUES('huruji',"xiezhiqiang");

SELECT * FROM testnull;

INSERT testnull(username,age) VALUES("xie","12");



--测试默认值
CREATE TABLE testfault(
id INT UNSIGNED KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL,
password CHAR(32) NOT NULL,
age TINYINT UNSIGNED DEFAULT 18,
addr VARCHAR(50) NOT NULL DEFAULT "中山大学",
sex ENUM("男","女","保密")
);

INSERT testfault(username,password) VALUES ("XIE","ZHI");
SELECT * FROM testfault;
INSERT testfault VALUES(DEFAULT,"xie","huruji",DEFAULT,"北京大学","保密");
SELECT * FROM testfault;

--测试UNIQUE KEY
--有undigned的时key要位于其后
CREATE TABLE testunique(
id INT  UNSIGNED KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL UNIQUE KEY,
card CHAR(18) UNIQUE
);
DESC testunique;
SHOW CREATE TABLE testunique;

INSERT testunique(username) VALUES('HURUJI');
SELECT * FROM testunique;
INSERT testunique(username,card) VALUES('huruji1',"xie");


--创建表的完整语法
CREATE TABLE [IF NOT EXISTS] tab_name(
字段名称 字段类型 [UNSIGNED | ZEROFILL] [NOT NULL] 
[DEFAULT 默认值] [[PRIMARY] KEY] | UNIQUE [KEY]] [AUTO_INCREMENT],
......
) ENGINE=INNODB CHARSET=UTF8 AUTO_INCREMENT=100;

--为学员表添加完整性约束条件
CREATE TABLE myuser(
id SMALLINT UNSIGNED NOT NULL KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL,
age TINYINT UNSIGNED NOT NULL DEFAULT "18",
sex ENUM('男','女','保密') NOT NULL DEFAULT "男",
email VARCHAR(50) NOT NULL UNIQUE,
addr VARCHAR(200) NOT NULL DEFAULT "北京",
birth YEAR,
salary FLOAT(8,2),
married TINYINT(1) NOT NULL DEFAULT "1" COMMENT '0代表结婚'
)ENGINE=INNODB CHARSET=UTF8;

DESC myuser;
SHOW CREATE TABLE myuser;


CREATE TABLE hurujiuser(
id SMALLINT UNSIGNED KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL UNIQUE,
password CHAR(32) NOT NULL,
email char(50) NOT NULL DEFAULT "594613537@qq.com",
age TINYINT UNSIGNED DEFAULT 18,
sex ENUM("男","女") NOT NULL DEFAULT "男",
addr VARCHAR(200) NOT NULL DEFAULT "北京",
salary FLOAT(6,2),
regtime INT UNSIGNED,
face char(100) NOT NULL DEFAULT "default.jpg"
);
DESC hurujiuser;

--修改表名
ALTER TABLE hurujiuser RENAME TO xieuser;
SHOW TABLES;

ALTER TABLE xieuser RENAME AS hurujiuser;
SHOW TABLES;

ALTER TABLE hurujiuser RENAME xieuser;
SHOW TABLES；

RENAME TABLE xieuser TO hurujiuser;
SHOW TABLES;


--添加与删除字段
ALTER TABLE hurujiuser ADD card CHAR(18);
DESC hurujiuser;
ALTER TABLE hurujiuser ADD test1 VARCHAR(199) NOT NULL UNIQUE;

ALTER TABLE hurujiuser ADD test2 VARCHAR(100) NOT NULL DEFAULT "我是傻逼" FIRST;

ALTER TABLE hurujiuser ADD test3 INT AFTER card;
DESC hurujiuser; 

--选中一个表完成多个操作
ALTER TABLE hurujiuser

ADD test4 CHAR NOT NULL,
ADD test5 VARCHAR(20) DEFAULT "人生" FIRST,
ADD test6 VARCHAR(30) AFTER id;

--删除字段
ALTER TABLE hurujiuser DROP test1;
DESC hurujiuser; 
ALTER TABLE hurujiuser DROP card;
--删除多个字段
ALTER TABLE hurujiuser
DROP test2,
DROP test3,
DROP test4,
DROP test5,
DROP test6;

DESC hurujiuser;

--同时执行添加与删除
ALTER TABLE hurujiuser 
ADD test INT(10),
DROP card;
DESC hurujiuser;

--修改字段
ALTER TABLE hurujiuser MODIFY email VARCHAR(200) NOT NULL DEFAULT "594613537@qq.com";
DESC hurujiuser;
--修改字段位置
ALTER TABLE hurujiuser MODIFY email VARCHAR(200) AFTER addr;
DESC hurujiuser;
ALTER TABLE hurujiuser MODIFY email VARCHAR(200) NOT NULL DEFAULT "594613537@qq.com";
DESC hurujiuser;

ALTER TABLE hurujiuser MODIFY username VARCHAR(20) NOT NULL UNIQUE FIRST;
DESC hurujiuser;

ALTER TABLE hurujiuser ADD test VARCHAR(30) NOT NULL;
DESC hurujiuser;
ALTER TABLE hurujiuser CHANGE test test1 VARCHAR(30) NOT NULL;
ALTER TABLE hurujiuser CHANGE test1 test1 VARCHAR(30) NOT NULL AFTER id;
DESC hurujiuser;
ALTER TABLE hurujiuser DROP test1;
DESC hurujiuser;

ALTER TABLE hurujiuser MODIFY username VARCHAR(20) NOT NULL UNIQUE AFTER id;
DESC hurujiuser;

ALTER TABLE hurujiuser ADD card VARCHAR(20) NOT NULL DEFAULT "HURUJI";


--测试添加主键
CREATE TABLE testpri(
id INT(8)
);
ALTER TABLE testpri ADD name VARCHAR(20) NOT NULL;
ALTER TABLE testpri ADD PRIMARY KEY(name);

CREATE TABLE testpri2(
id INT(8),
name VARCHAR(20),
age int(10)
);
ALTER TABLE testpri2 ADD PRIMARY KEY(id,name);
DESC testpri2;
ALTER TABLE testpri2 DROP PRIMARY KEY;
DESC testpri2;
ALTER TABLE testpri DROP PRIMARY KEY;
DESC testpri;
ALTER TABLE testpri2 MODIFY id INT(8) UNSIGNED KEY AUTO_INCREMENT;
ALTER TABLE testpri2 DROP PRIMARY KEY;
ALTER TABLE testpri2 MODIFY id INT(8) UNSIGNED;
DESC testpri2;
ALTER TABLE testpri2 DROP PRIMARY KEY;
DESC testpri2;


--测试添加唯一
CREATE TABLE testuni(
id int(8) UNSIGNED KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL,
card CHAR(20) NOT NULL
);
ALTER TABLE testuni ADD UNIQUE(username);
DESC testuni;
ALTER TABLE testuni ADD  UNIQUE uni_card (card);
DESC testnui;
SHOW CREATE TABLE testuni;

--测试为两个字段添加唯一索引
ALTER TABLE testuni 
ADD age INT,
ADD num INT;

ALTER TABLE testuni ADD UNIQUE INDEX mul_age_num(age,num);

--删除唯一索引
ALTER TABLE testuni DROP INDEX username;
DESC testuni;
ALTER TABLE testuni DROP KEY uni_card;
DESC testuni;
ALTER TABLE testuni DROP INDEX mul_age_num;
DESC testuni;

--删除数据库
DROP TABLE IF EXISTS testchar;
DROP TABLE IF EXISTS testint;

--测试插入记录
CREATE TABLE IF NOT EXISTS testinsert(
id TINYINT UNSIGNED AUTO_INCREMENT KEY,
username VARCHAR(20) NOT NULL UNIQUE,
password CHAR(32) NOT NULL,
email VARCHAR(50) NOT NULL DEFAULT "594613537@qq.com",
age TINYINT UNSIGNED DEFAULT 18
);

INSERT testinsert VALUES(1,"HURUJI","XIE",DEFAULT,DEFAULT);
INSERT testinsert VALUE(2,"HU","HUHU","8989@123.com",DEFAULT);
SELECT * FROM testinsert;
INSERT testinsert(username,password) VALUES("a","afasdf");
SELECT * FROM testinsert;

INSERT testinsert VALUES(DEFAULT,"xie","xiezhiqinag1","123@op.com",DEFAULT),
(DEFAULT,"ZHI","HUJIRU","12345@qq.com",default),
(DEFAULT,"ru","ji",DEFAULT,DEFAULT);
SELECT * FROM testinsert;

INSERT testinsert SET id=DEFAULT,username="xiehiz",password="huuu";
SELECT * FROM testinsert;

--插入多条记录

--将查询结果插入表中
CREATE TABLE mytest(
id TINYINT UNSIGNED KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL
);
INSERT mytest SELECT id,username FROM testinsert;


--
CREATE TABLE xieuser(
id TINYINT UNSIGNED NOT NULL KEY AUTO_INCREMENT,
username VARCHAR(20) NOT NULL UNIQUE,
password CHAR(32) NOT NULL DEFAULT "*hope8848",
age int(8) NOT NULL DEFAULT 18,
eamil VARCHAR(50) DEFAULT "594613537@qq.com"
);
INSERT xieuser(id,username) VALUES (DEFAULT,"xie"),
(DEFAULT,"zhi"),(DEFAULT,"qi"),(DEFAULT,"ang"),(DEFAULT,"huruji");
SELECT * FROM xieuser;
---将所有的age改为15;
UPDATE xieuser SET age=15;
SELECT * FROM xieuser;
UPDATE xieuser SET age=20,eamil="788787788887@qq.com";
SELECT * FROM xieuser;
ALTER TABLE xieuser CHANGE eamil email VARCHAR(50) DEFAULT "333333@222.com";
DESC xieuser;

UPDATE xieuser SET age=7;
SELECT * FROM xieuser;

UPDATE xieuser SET password="123",email="123@qq.com",age=110 WHERE id=1;
SELECT * FROM xieuser;
UPDATE xieuser SET age=age-5 WHERE id>=3;
SELECT * FROM xieuser;
UPDATE xieuser SET age=DEFAULT;
SELECT * FROM xieuser;
ALTER TABLE xieuser DROP email;

DELETE FROM xieuser WHERE id=1;
SELECT * FROM xieuser;
ALTER TABLE xieuser AUTO_INCREMENT=1;

--彻底清空表格
INSERT xieuser(id,username) VALUES (DEFAULT,"xie"),
(DEFAULT,"zhi"),(DEFAULT,"qi"),(DEFAULT,"ang"),(DEFAULT,"huruji");
SELECT * FROM xieuser;

TRUNCATE TABLE xieuser;
SELECT * FROM xieuser;


--查询
SELECT id,username FROM cms_admin;
SELECT username,id FROM cms_admin WHERE username="king";
--表来自哪个数据库
SELECT id,username FROM cms.cms_admin;
--字段来自哪张表
SELECT cms_admin.id,cms_admin.username FROM cms.cms_admin;

--给表名起别名
SELECT id,username FROM cms_admin AS a;
SELECT a.id,a.username,a.email,a.role FROM cms_admin AS a;

--给字段起别名
SELECT id AS "编号",username AS "用户名",email AS "邮箱",role AS "角色" FROM cms_admin;

--WHERE条件
SELECT id,username,email FROM cms_user WHERE id=1;
SELECT id,username,email FROM cms_user WHERE username="king";
SELECT * FROM cms_user WHERE id>=5;
SELECT * FROM cms_user WHERE id!=1;
SELECT * FROM cms_user Where id<>1;

ALTER TABLE cms_user ADD age TINYINT UNSIGNED DEFAULT 18;

INSERT cms_user(username,password,regtime,proId,age) VALUES("test1","test2",1478787878,1,NULL);

SELECT * FROM cms_user WHERE age=NULL;
SELECT * FROM cms_user WHERE age<=>NULL;
--IS NULL
SELECT * FROM cms_user WHERE age IS NULL;
SELECT * FROM cms_user WHERE age IS NOT NULL;

SELECT * FROM cms_user WHERE id NOT BETWEEN 3 AND 10;

SELECT * FROM cms_user WHERE id IN(1,2,4,7,9,13,1111);
SELECT * FROM cms_user WHERE proid IN(1,3,45);

SELECT * FROM cms_user WHERE username IN("张三","章子","老三","公孙博儿");
SELECT * FROM cms_user WHERE id NOT IN(1,2,4,5,7,12);



--模糊查询
--%:代表0个、一个或者多个任意字符
-- _：代表1个任意字符
--查询姓张的用户
SELECT * FROM cms_user WHERE username LIKE "%张%";
SELECT * FROM cms_user WHERE username LIKE "%子%";
SELECT * FROM cms_user WHERE username LIKE "张%";
SELECT * FROM cms_user WHERE username LIKE "%";
SELECT * FROM cms_user WHERE username LIKE "___";
SELECT * FROM cms_user WHERE username LIKE "____";
SELECT * FROM cms_user WHERE username LIKE "_I%" ;


--逻辑运算符
--查询用户名为king和密码也为king的用户
SELECT * FROM cms_user WHERE username="king" AND password="king";

--查询编号大于等于3并且年龄不为NULL的
SELECT * FROM cms_user Where id>=3 AND age IS NOT NULL;
SELECT * FROM cms_user WHERE id>=3 AND age IS NOT NULL AND proid=3;

SELECT * FROM CMS_USER WHERE ID>=5 AND ID<=10 AND username LIKE "____";
SELECT * FROM CMS_USER Where username LIKE "张%" OR proid IN(2,4);


--按照用户所属省份进行分组
SELECT * FROM cms_user GROUP BY proid;

ALTER TABLE cms_user ADD sex ENUM("男","女","保密");
UPDATE cms_user SET sex="男" WHERE id IN(1,3,5,7,9);
UPDATE cms_user SET sex="女" WHERE id IN(2,4,6,8,10);
UPDATE cms_user SET sex="保密" WHERE id IN(11,12,13);

SELECT * FROM cms_user GROUP BY sex;
SELECT * FROM cms_user GROUP BY 9;

--按照多个字段分组
SELECT * FROM cms_user GROUP BY sex,proid;

SELECT * FROM cms_user WHERE ID>=5 group BY sex;

--查询id，sex，用户名详情按照性别分组
SELECT id,sex FROM cms_user GROUP BY sex;
SELECT id,sex,GROUP_CONCAT(username) FROM cms_user GROUP BY sex;
SELECT id,sex,GROUP_CONCAT(proid) FROM cms_user GROUP BY sex;

select proid,GROUP_CONCAT(username),GROUP_CONCAT(sex),GROUP_CONCAT(regTime) FROM cms_user GROUP BY proId\G;


UPDATE cms_user SET age=11 WHERE id=1;
UPDATE cms_user SET age=22 WHERE id=2;
UPDATE cms_user SET age=32 WHERE id=3;
UPDATE cms_user SET age=3 WHERE id=5
UPDATE cms_user SET age=34 WHERE id=4;
UPDATE cms_user SET age=90 WHERE id=6;
UPDATE cms_user SET age=110 WHERE id=7;
UPDATE cms_user SET age=45 WHERE id=8;
UPDATE cms_user SET age=61 WHERE id=9;
UPDATE cms_user SET age=14 WHERE id=10;
UPDATE cms_user SET age=82 WHERE id=11;
UPDATE cms_user SET age=3 WHERE id=12;
UPDATE cms_user SET age=10 WHERE id=1;


--统计记录总数
--查询编号。sex。用户户名详情以及组中的总人数按照sex分组
SELECT id,sex,GROUP_CONCAT(username) AS users,COUNT(*) AS totalUsers FROM cms_user GROUP BY sex;

SELECT COUNT(id) AS totalUsers FROM cms_user;
SELECT COUNT(age)  FROM cms_user;

SELECT id,sex,GROUP_CONCAT(username) AS users,
COUNT(*) AS totalUsers,
MAX(age) AS max_age,
MIN(age) AS min_age,
AVG(age) AS avg_age,
SUM(age) AS sum_age
FROM cms_user GROUP BY sex;

SELECT id,sex,GROUP_CONCAT(username) AS users,
COUNT(*) AS totalUsers,
MAX(age) AS max_age,
MIN(age) AS min_age,
AVG(age) AS avg_age,
SUM(age) AS sum_age
FROM cms_user GROUP BY sex WITH ROLLUP;

--HAVING字句的使用
SELECT sex,GROUP_CONCAT(username) AS users,
COUNT(*) AS totalUsers,
MAX(age) AS max_age,
SUM(age) AS total_age
FROM cms_user GROUP BY sex;

--二次筛选
SELECT sex,GROUP_CONCAT(username) AS users,
COUNT(*) AS totalUsers,
MAX(age) AS max_age,
SUM(age) AS total_age
FROM cms_user GROUP BY sex HAVING COUNT(*)>2;

--查询组中人数大于2并且最大年龄大于60的组

--按照id降序排列desc 默认是ASC
SELECT * FROM cms_user ORDER BY id;
SELECT * FROM cms_user ORDER BY id ASC;
SELECT * FROM cms_user ORDER BY id DESC;

SELECT * FROM cms_user ORDER BY age;
SELECT * FROM cms_user ORDER BY age DESC;

SELECT * FROM cms_user ORDER BY 1 DESC;
SELECT * FROM cms_user ORDER BY 7 DESC;

SELECT * FROM cms_user ORDER BY age ASC,id DESC;
 UPDATE cms_user SET age=11 WHERE id=5;

SELECT id,age,sex,GROUP_CONCAT(username),COUNT(*) AS totalUsers,SUM(age) AS sum_age
FROM cms_user WHERE id>=2 GROUP BY sex HAVING COUNT(*)>=2 ORDER BY age DESC, id ASC;

--实现随机记录
SELECT * FROM cms_user ORDER BY RAND();

--查询表中前三条记录
SELECT * FROM cms_user LIMIT 3;
SELECT * FROM cms_user ORDER BY id DESC LIMIT 5;

--查询表中前一条记录
SELECT * FROM cms_user LIMIT 1;
SELECT * FROM cms_user LIMIT 0,1;
SELECT * FROM cms_user LIMIT 2,5;
SELECT * FROM cms_user LIMIT 7,5;


SELECT id,sex,age,GROUP_CONCAT(username),
COUNT(*) AS totalusers,
MAX(age) AS max_age,
MIN(age) AS min_age,
AvG(age) AS avg_age,
SUM(age) AS sum_age
FROM cms_user
WHERE id>=1
GROUP BY sex
HAVING COUNT(*)>=2 ORDER BY age DESC LIMIT 2;


--更新用户名为4位的用户，让其年龄为3
UPDATE cms_user SET age=age-3 WHERE username LIKE "____";
UPDATE cms_user SET age=age+10 LIMIT 3;

--按照id降序排列，更新前3条
UPDATE cms_user SET age=age+10 ORDER BY id DESC LIMIT 3;

--删除用户性别为男，按照年龄降序排列的一条记录
DELETE FROM cms_user WHERE sex="男" ORDER BY age DESC LIMIT 1;


--连接查询
SELECT id,username,proid FROM cms_user;
SELECT * FROM provinces;
SELECT cms_user.id,username,proname FROM cms_user,provinces;
--cms_user的proid对应省份表中的id
SELECT cms_user.id,username,proname FROM cms_user,provinces
WHERE cms_user.proId=provinces.id;

--查询cms_user表中的id,username,email.sex
--查询provinces表中的proName
SELECT u.id,u.username,u.email,u.sex,p.proname
FROM cms_user AS u
INNER JOIN provinces AS p 
ON u.proid=p.id;

SELECT u.id,u.username,p.proName
FROM provinces AS p
CROSS JOIN cms_user AS u
ON p.id=u.proid;

SELECT u.id,u.username,u.sex,p.proName
FROM cms_user AS u JOIN 
provinces AS p
ON u.proid=p.id
WHERE u.sex="男";


SELECT u.id,u.username,u.sex,u.email,p.proName,COUNT(*) AS totalusers,GROUP_CONCAT(u.username)
FROM cms_user AS u
INNER JOIN provinces AS p
ON u.proid=p.id GROUP BY p.proname
HAVING COUNT(*)>2
ORDER BY u.id DESC LIMIT 1;

SELECT n.id,n.title,n.clickNum,n.pubTime,n.aId,c.cateName FROM cms_news AS n
INNER JOIN cms_cate AS c
ON n.cid=c.id;

SELECT n.id,n.title,a.username,a.role FROM cms_news AS n
INNER JOIN cms_admin AS a
ON n.aid=a.id;

SELECT n.id,n.title,c.cateName,a.username,a.role
FROM cms_news AS n
JOIN cms_cate AS c
ON n.cid=c.id
JOIN
cms_admin AS a
ON n.aid=a.id;

--创建部门表（主表）
CREATE TABLE IF NOT EXISTS department(
id TINYINT UNSIGNED AUTO_INCREMENT KEY,
depName VARCHAR(20) NOT NULL UNIQUE
)ENGINE=INNODB;

INSERT department(depName) VALUES("教学部")
,("市场部")
,("运营部")
,("督导部");

--创建员工表(字表)
CREATE TABLE IF NOT EXISTS employee(
id SMALLINT UNSIGNED AUTO_INCREMENT KEY,
username VARCHAR(20) NOT NULL UNIQUE,
depId TINYINT UNSIGNED,
CONSTRAINT emp_fk_dep FOREIGN KEY(depId) REFERENCES department(id)
)ENGINE=INNODB;

INSERT employee(username,depId) VALUES("king",1),
("quee",2),
("hu",3),
("ru",4),
("ji",1);

SELECT e.id,e.username,d.depName FROM employee AS e
INNER JOIN department AS d
ON e.depId=d.id;

DELETE FROM department WHERE depName="督导部";

DELETE FROM department WHERE id=1;

DELETE FROM employee WHERE depId=1;

--删除外键
ALTER TABLE employee DROP FOREIGN KEY emp_fk_dep;

--添加外键
ALTER TABLE employee ADD CONSTRAINT emp_fk_dep FROEIGN KEY(depId) REFERENCES department(id);
--联合查询
SELECT username FROM employee UNION SELECT username FROM cms_user;

--子查询
SELECT id username FROM employee WHERE depId IN(SELECT id FROM department);

--创建学员表student
CREATE TABLE IF NOT EXISTS student(
id TINYINT UNSIGNED AUTO_INCREMENT KEY,
username VARCHAR(20) NOT NULL UNIQUE,
score TINYINT UNSIGNED
);
INSERT student(username,score) VALUES("king",95),
("king1",92),
("king2",55),
("king3",75),
("king4",87),
("king5",23),
("king6",99),
("king7",67),
("king8",76),
("king9",89),
("king10",91);


--创建奖学金表
CREATE TABLE IF NOT EXISTS scholarship(
id TINYINT UNSIGNED AUTO_INCREMENT KEY,
level TINYINT UNSIGNED
);
INSERT scholarship(level) values(90),(80),(70);
--查询获得一等奖学金的学生有
SELECT id,username FROM student WHERE score>=(SELECT level FROM scholarship WHERE id=1);
SELECT id,username FROM employee WHERE EXISTS(SELECT * from department where id=5);














CREATE TABLE user(
id INT UNSIGNED KEY NOT NULL AUTO_INCREMENT,
username VARCHAR(20) UNIQUE NOT NULL,
password CHAR(32)  NOT NULL
);
INSERT user(username,password) VALUES("忽如寄","123456"),
("周杰伦","654321"),("令狐冲","13579"),("东方不败","02468");


INSERT user_info VALUES("huruji","1","huruji","管理员","123456");

--正则表达式
SELECT * FROM cms_user WHERE username REGEXP "^t";

SELECT * FROM cms_user WHERE username REGEXP "g$";

SELECT * FROM cms_user WHERE username REGEXP ".";

SELECT * FROM cms_user WHERE username REGEXP "r..g";

SELECT * FROM cms_user WHERE username REGEXP "[^a-z]";

SELECT * FROM cms_user WHERE username REGEXP "ng|en";

SELECT * FROM cms_user WHERE username REGEXP "que{1,3}";


SELECT username,username="king" FROM student;

SELECT username,username!="king" FROM student;

SELECT id,username,age,age BETWEEN 10 AND 30 FROM cms_user;

SELECT 12 IN(13,14);

SELECT id,username,username LIKE "____" FROM cms_user;

SELECT id,username,username REGEXP "^t" FROM cms_user;


SELECT 2&&2,2&&0,2&&NULL,1||1,1||0,1||NULL;


--函数库
--版本
SELECT VERSION();
--时间
SELECT NOW();
--数学函数
CEIL()
FLOOR()
MOD()
ABS()

--字符串函数库
--CHAR_LENGTH返回字符串的字符数，LENGTH返回字符串的长度
--一个中文字字符数为1，长度为3
SELECT CHAR_LENGTH("huruji"),LENGTH("huruji");
SELECT CHAR_LENGTH("忽如寄"),LENGTH("忽如寄");

SELECT id,CONCAT(username,"_") FROM student;

SELECT CONCAT("HELLO ","world","sssf");
SELECT CONCAT('j',"jk",null)
SELECT CONCAT_WS(",","HELLO","WORLD","JKJK");
SELECT LEFT("sbcdef",2);
SELECT RIGHT("ABCDEF",2);
--LPAD和RPAD填充至指定长度
SELECT LPAD("A",10,"3"),RPAD("B",10,"as");
--比较两个字符串是否相等STRCMP
SELECT STRCMP("A","a"),STRCMP("B","A"),STRCMP("A","B");

--日期函数
--CURDATE()/CURRENT_DATE()
--CURTIME()/CURRENT_TIME()
--NOW()
--MONTH(D)
--MONTHNAME(D)
--DAYNAME(D)
--DAYOFWEEK(D)
--WEEKDAY(D)
--WEEK(D)
SELECT CURDATE(),CURRENT_DATE(),CURRENT_TIME(),NOW(),MONTH(CURDATE());
SELECT DAYOFWEEK(NOW()),WEEKDAY(NOW()),WEEK(NOW());
SELECT DATEDIFF(CURRENT_DATE(),"1900-1-1");

SELECT * FROM cms_user;

UPDATE cms_user SET age=null WHERE id=12;

SELECT id,username,age,IFNULL(age,"年龄没有") FROM cms_user;
SELECT id,username,age,IF(age>12,"1","2") FROM cms_user;


USE testmail;

CREATE TABLE mailuser(
mid INT UNSIGNED NOT NULL AUTO_INCREMENT KEY,
bookname VARCHAR(200) NOT NULL,
bookId VARCHAR(30) NOT NULL UNIQUE,
bookGroup VARCHAR(30) NOT NULL,
userName VARCHAR(50) NOT NULL,
borrowDate Date NOT null,
getDate Date NOT NULL
);

INSERT mailuser(bookname,bookId,bookGroup,userName,borrowDate,getDate) VALUES(
"版式设计原理","DE134-2","编程组","忽如寄","2016-08-25","2016-09-25"
);


SELECT NOW(),CURRENT_TIMESTAMP(),LOCALTIME(),SYSDATE(),LOCALTIMESTAMP();





1、返回当前日期：**CURDATE()**、CURRENT_DATE()
2、返回当前时间：**CURTIME()**、CURRENT_TIME()
![](http://upload-images.jianshu.io/upload_images/1641380-dff969bce614942d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3、返回当前日期和时间：**NOW()**、CURRENT_TIMESTAMP()、LOCALTIME()、SYSDATE()、LOCALTIMESTAMP()
4、以UNIX时间戳形式返回当前时间：UNIX_TIMESTAMP()，UNIX时间戳是指从1970年1月1日经历的秒数
5、将时间d转换为UNIX时间戳：UNIX_TIMESTAMP(d)
6、将UNIX时间戳转换为普通格式的时间：FROM_UNIXTIME(d)
7、返回UTC（国际协调时间）日期：UTC_DATE()
8、返回UTC时间：UTC_TIME()
9、返回日期d的月份值，范围1~12：**MONTH(d)**
10、返回日期d的月份的英文名称：**MONTHNAME(d)**
11、返回日期d的星期英文名称：**DAYNAME(d)**
12、返回日期d的星期，1表示星期日，2表示星期一：DAYOFWEEK(d)
13、返回日期d的星期，0表示星期一，1表示星期二：WEEKDAY(d)
14、返回日期d是本年的第几个星期，范围0~53：WEEK(d)
15、返回日期d是本年的第几个星期，范围1~53：WEEKOFYEAR(d)
16、返回日期d是本年的第几天：DAYOFYEAR(d)
17、返回日期d是本月的第几天：DAYOFMONTH(d)
18、返回日期d中的年份值：YEAR(d)
19、返回日期d是第几季度：QUARTER(d)
20、返回时间t中的小时值：HOUR(t)
21、返回时间t中的分钟值：MINUTE(t)
22、返回时间t中的秒钟值：SECOND(t)
23、从日期t中获取指定的值：**EXTRACT(type FROM d)**，type可以是YEAR、MONTH、HOUR等
24、将时间t转换为秒：TIME_TO_SEC(t);
25、将以秒为单位的时间s转换为时分秒的格式：SEC_TO_TIME(s)
26、计算日期d~0000年1月1日的天数：TO_DAYS(d)
27、计算从0000年1月1日开始n天后的日期：FROM_DAYS(n)
28、计算日期d1~d2之间相隔的天数：DATEDIFF(d1,d2)，天数为d1-d2，可以为负数
29、计算起始日期d加上n天后的日期：**ADDDATE(d,n)**
30、计算起始日期d减去n天日期：**SUBDATE(d,n)**
31、计算起始时间t加上n秒后的时间：**ADDTIME(t,n)**
32、计算起始时间t减去n秒后的时间：**SUBTIME(t,n)**




SELECT VERSION(),CONNECTION_ID(),DATABASE(),SCHEMA();

SELECT USER(),SYSTEM_USER(),SESSION_USER(),CURRENT_USER(),CURRENT_USER;

SELECT CHARSET("huruji"),COLLATION("huruji"),LAST_INSERT_ID();

SELECT ASCII("ABC"),BIN(2),HEX(17),OCT(10),CONV(8,10,8);