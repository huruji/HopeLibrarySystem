--创建数据库
CREATE DATABASE hopeTest DEFAULT CHARACTER SET "utf8";
--切换数据库
USE hopeTest;
--创建读者数据表
CREATE TABLE hopereader(
readerID INT KEY AUTO_INCREMENT,
readerName VARCHAR(20),
readerSex ENUM("男","女","保密"),
readerGroup Enum("网管组","编程组","设计组","前端组","数码组"),
studentNumber INT(8),
readerMajor VARCHAR(20),
readerPhone INT(11)
);

--录入部分读者数据
INSERT hopereader(readerName,readerSex,readerGroup,studentNumber,readerMajor,readerPhone) 
VALUES("忽如寄","男","编程组","12345678","高分子材料与工程","1123344556");

INSERT hopereader(readerName,readerSex,readerGroup,studentNumber,readerMajor,readerPhone) 
VALUES("周杰伦","男","编程组","14333990","高分子材料与工程","12879020982");

INSERT hopereader(readerName,readerSex,readerGroup,studentNumber,readerMajor,readerPhone) 
VALUES("令狐冲","男","网管组","14344560","材料化学","13567890987");

INSERT hopereader(readerName,readerSex,readerGroup,studentNumber,readerMajor,readerPhone) 
VALUES("东方不败","女","设计组","1346591","化学生物学","18866800011");

INSERT hopereader(readerName,readerSex,readerGroup,studentNumber,readerMajor,readerPhone) 
VALUES("郭靖","女","前端组","12334570","化学工程与工艺","13678900983");

INSERT hopereader(readerName,readerSex,readerGroup,studentNumber,readerMajor,readerPhone) 
VALUES("风清扬","女","数码组","15678901","应用化学","11909808009");