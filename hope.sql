CREATE DATABASE IF NOT EXISTS hopeWechat CHARACTER SET utf8;

USE hopeWechat;

CREATE TABLE hopeReader(
readerID INT KEY AUTO_INCREMENT,
readerName VARCHAR(20) NOT NULL UNIQUE,
readerPassword VARCHAR(32) NOT NULL,
readerSex ENUM("男","女") default "男",
readerGroup Enum("网管组","编程组","设计组","前端组","数码组"),
studentNumber varchar(8),
readerMajor VARCHAR(20),
readerPhone varchar(11),
readerEmail VARCHAR(100),
readerBadNum INT(11)
);

INSERT hopeReader VALUES(1,"忽如寄","8c0c831640c1da9f210e8951758aed5a","男","编程组","14322223","高分子材料与工程","18826073191","594613537@qq.com",0);

ALTER TABLE hopeReader MODIFY studentNumber varchar(8);
ALTER TABLE hopeReader MODIFY readerPhone VARCHAR(11);

CREATE TABLE hopeBook(
bookID INT KEY AUTO_INCREMENT,
bookImgSrc varchar(100) default("/img/book/bookdefault.jpg"),
bookName VARCHAR(100) NOT NULL,
bookHopeID VARCHAR(100) NOT NULL UNIQUE,
bookAuthor varchar(100),
bookISBN varchar(100) NOT NULL,
bookPress varchar(100),
bookCate Enum("编程类","设计类","摄影类","其他") NOT NULL;
bookLeft tINYINT(1) default 1,
);

INSERT hopeBook(bookName,bookHopeID,bookAuthor,bookISBN,bookPress,bookCate) VALUES("一本摄影书","ca-111","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-112","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-113","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-114","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-115","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-116","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-117","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-118","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-119","赵嘉","111111","电子工业出版社","摄影类"),
("摄影的技术","ca-120","赵嘉","111111","电子工业出版社","摄影类"),
("编程高手","pr-111","忽如寄","111111","电子工业出版社","编程类"),
("编程高手","pr-112","忽如寄","111111","电子工业出版社","编程类"),
("编程高手","pr-113","忽如寄","111111","电子工业出版社","编程类"),
("编程高手","pr-114","忽如寄","111111","电子工业出版社","编程类"),
("编程高手","pr-115","忽如寄","111111","电子工业出版社","编程类"),
("设计指南","de-115","忽如寄","111111","电子工业出版社","设计类"),
("设计指南","de-116","忽如寄","111111","电子工业出版社","设计类"),
("化学实验爆炸指南","ot-116","忽如寄","111111","电子工业出版社","设计类");



UPDATE hopeBook SET bookLeft=1;
SELECT * FROM hopeBook;


CREATE TABLE bookBorrow(
borrowID INT KEY AUTO_INCREMENT,
borrowBookID INT(8) NOT NULL,
borrowUserID INT(8) NOT NULL,
borrowTime DATE NOT NULL,
returnWhe TINYINT(1) DEFAULT 0
/* 0代表未归还*/
);


/*增加应该归还时间*/
ALTER TABLE bookBorrow ADD retrunBefore DATE;
INSERT bookBorrow VALUES(DEFAULT,36,1,"2016-10-14",DEFAULT);
INSERT bookBorrow values(DEFAULT,36,1,CURDATE(),DEFAULT);
SELECT * FROM bookBorrow;


SELECT bookName,readerName,borrowTime,returnWhe FROM hopeBook,hopeReader,bookBorrow WHERE hopeBook.bookID=bookBorrow.borrowBookID AND hopeReader.readerID=bookBorrow.borrowUserID AND returnWhe=1;

SELECT bookName,readerName,borrowTime,returnWhe FROM hopeBook,hopeReader,bookBorrow WHERE hopeReader.readerID=bookBorrow.borrowUserID;

UPDATE bookBorrow SET returnWhe=1;


CREATE TABLE hopeAdmin(
adminID INT KEY AUTO_INCREMENT,
adminName VARCHAR(20) NOT NULL UNIQUE,
adminPassword VARCHAR(32) NOT NULL,
adminEmail VARCHAR(100)
);

INSERT hopeAdmin VALUES(DEFAULT,"周杰伦","8c0c831640c1da9f210e8951758aed5a","594613537@qq.com");
SELECT * FROM hopeAdmin;

ALTER TABLE hopeAdmin ADD adminImgSrc VARCHAR(100) DEFAULT "/img/admin/admin-fault.jpg";
ALTER TABLE hopeAdmin MODIFY adminImgSRC VARCHAR(100) DEFAULT "/img/admin/admin-default.jpg";
ALTER TABLE hopeAdmin CHANGE adminImgSRC adminImgSrc VARCHAR(100) DEFAULT "/img/admin/admin-default.jpg";

ALTER TABLE hopeAdmin ADD adminPermissions Enum("super","book","camera") DEFAULT "book";

UPDATE hopeBook SET bookLeft=0 WHERE bookID=36;INSERT bookBorrow VALUES(DEFAULT,36,1,CURDATE(),DEFAULT);

SELECT bookName,readerName,borrowTime,returnWhe FROM hopeBook,hopeReader,bookBorrow WHERE hopeBook.bookID=bookBorrow.borrowBookID AND hopeReader.readerID=bookBorrow.borrowUserID AND returnWhe=0 AND readerID=1;

SELECT bookName,userImgSrc,retrunBefore FROM hopeBook,hopeReader,bookBorrow WHERE hopeBook.bookID=bookBorrow.borrowBookID AND hopeReader.readerID=bookBorrow.borrowUserID AND returnWhe=0 AND readerID=1;

UPDATE hopeBook SET bookLeft=bookLeft-1 WHERE bookID=36;

UPDATE hopeBook SET bookLeft=bookLeft-1 WHERE bookID=36;

UPDATE hopeBook,bookBorrow SET bookLeft=bookLeft+1,returnWhe=1 WHERE bookID=32 AND borrowBookID=32;

UPDATE bookBorrow SET returnWhe= WHERE bookID=36;


UPDATE HOPEBOOK SET bookLeft=0 WHERE bookID IN(32,33,36);
UPDATE bookBorrow SET returnWhe=0 WHERE borrowID IN(8,9,10);
SELECT * FROM hopeBook;
select * FROM bookBorrow;

INSERT hopeReader VALUES(1,"忽如寄","8c0c831640c1da9f210e8951758aed5a","男","编程组","14322223","高分子材料与工程","18826073191","594613537@qq.com",0);

INSERT hopeReader VALUES(2,"谢志强","8c0c831640c1da9f210e8951758aed5a","男","设计组","1432262","高分子材料与工程","18926073191","594619537@gamil.com",0,DEFAULT),
(3,"周杰伦","8c0c831640c1da9f210e8951758aed5a","男","设计组","1432722","材料化学","13426073191","594619537@126.com",0,DEFAULT),
(4,"风清扬","8c0c831640c1da9f210e8951758aed5a","女","数码组","1132782","应用化学","13526073191","594619537@127.com",0,DEFAULT),
(5,"令狐冲","8c0c831640c1da9f210e8951758aed5a","男","数码组","12322287","化学生物学","13626073191","594619537@128.com",0,DEFAULT),
(6,"杨过","8c0c831640c1da9f210e8951758aed5a","女","前端组","09322247","高分子材料与工程","13726073191","594619537@129.com",0,DEFAULT),
(7,"东方不败","8c0c831640c1da9f210e8951758aed5a","女","前端组","14322267","化学工艺","13826073191","594619537@163.com",0,DEFAULT),
(8,"西方失败","8c0c831640c1da9f210e8951758aed5a","男","编程组","14322645","高分子材料与工程","13926073191","594619537@164.com",0,DEFAULT),
(9,"郭靖","8c0c831640c1da9f210e8951758aed5a","女","网管组","14322454","材料化学","14026073191","594619537@165.com",0,DEFAULT),
(10,"陈健文","8c0c831640c1da9f210e8951758aed5a","男","编程组","1332227","高分子材料与工程","14526073191","594619537@166.com",0,DEFAULT),
(11,"阳富城","8c0c831640c1da9f210e8951758aed5a","男","编程组","1332229","应用化学","14626073191","594619537@167.com",0,DEFAULT),
(12,"黄楼","8c0c831640c1da9f210e8951758aed5a","男","编程组","14322299","高分子材料与工程","14826073191","594619537@168.com",0,DEFAULT);





INSERT hopeAdmin VALUES(DEFAULT,"黄楼","8c0c831640c1da9f210e8951758aed5a","5943537@qq.com",DEFAULT,DEFAULT),
(DEFAULT,"曹颖雯","8c0c831640c1da9f210e8951758aed5a","5943537@gamil.com",DEFAULT,DEFAULT),
(DEFAULT,"阳富城","8c0c831640c1da9f210e8951758aed5a","345353790@qq.com",DEFAULT,"camera"),
(DEFAULT,"钟雯璇","8c0c831640c1da9f210e8951758aed5a","23423423423@qq.com",DEFAULT,"camera"),
(DEFAULT,"李胜波","8c0c831640c1da9f210e8951758aed5a","8989898@qq.com",DEFAULT,"camera");


UPDATE hopebook SET bookISBN=111112 WHERE bookID BETWEEN 20 AND 28;
UPDATE hopebook SET bookISBN=111113 WHERE bookID BETWEEN 29 AND 33;
UPDATE hopebook SET bookISBN=111114 WHERE bookID IN(34,35);
UPDATE hopeBook SET bookISBN=111115 WHERE bookID=36;
UPDATE hopeBook SET bookName="编程高手",bookCate="编程类" WHERE bookID=32;

ALTER TABLE hopeBook DROP bookNum;
ALTER TABLE hopeBook MODIFY bookISBN varchar(100) NOT NULL;
ALTER TABLE hopeBook MODIFY bookLeft tINYINT(1) default 1;