/*书籍表*/
CREATE TABLE hopeBook(
bookID INT KEY AUTO_INCREMENT,
bookImgSrc varchar(100) default("/img/book/bookdefault.jpg"),
bookName VARCHAR(100) NOT NULL,
bookHopeID VARCHAR(100) NOT NULL UNIQUE,
bookAuthor varchar(100),
bookISBN varchar(100) NOT NULL,
bookPress varchar(100),
bookCate Enum("编程类","设计类","摄影类","其他") NOT NULL,
bookLeft tINYINT(1) default 1
/*bookLeft=1表示在架上，bookLeft=0表示已借出*/
);

/*设备表*/
CREATE TABLE hopeEquip(
equipID INT KEY AUTO_INCREMENT,
equipHopeID VARCHAR(100) NOT NULL UNIQUE,
equipName VARCHAR(100) NOT NULL,
equipImgSrc VARCHAR(100) DEFAULT "/img/equip/equip-default.jpg",
equipAdminID INT NOT NULL,
equipLeft tINYINT(1) DEFAULT 1;
/*1代表在架上，0代表已借出*/
)
ALTER TABLE hopeEquip MODIFY equipAdminID INT;
INSERT hopeEquip VALUES(DEFAULT,"1","D810",DEFAULT,4),(DEFAULT,"2","松下AG-DVC180B",DEFAULT,4),(DEFAULT,"3","松下AG-DVC180B2",DEFAULT,4),(DEFAULT,"4","松下AG-DVC180B3",DEFAULT,4),
(DEFAULT,"5","D610甲",DEFAULT,4),(DEFAULT,"6","D610乙",DEFAULT,4);
INSERT hopeEquip VALUES(DEFAULT,"7","D810",DEFAULT,4,default),(DEFAULT,"8","松下AG-DVC180B",DEFAULT,4,DEFAULT),(DEFAULT,"9","松下AG-DVC180B2",DEFAULT,4,DEFAULT),(DEFAULT,"10","松下AG-DVC180B3",DEFAULT,4,DEFAULT),
(DEFAULT,"11","D610甲",DEFAULT,4,DEFAULT),(DEFAULT,"12","D610乙",DEFAULT,4,DEFAULT);
/*读者表*/
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
readerBadNum INT(11) DEFAULT 0,
userImgSrc varchar(100) DEFAULT "/img/user/user-default.jpg"
);


/*管理员表*/
CREATE TABLE hopeAdmin(
adminID INT KEY AUTO_INCREMENT,
adminName VARCHAR(20) NOT NULL UNIQUE,
adminPassword VARCHAR(32) NOT NULL,
adminEmail VARCHAR(100),
adminImgSrc varchar(100) DEFAULT "/img/admin/admin-default",
adminPermission ENUM("super","book","camera") DEFAULT "book"
/*adminPermission中super表示超级管理员、book表示图书管理员、camera表示相机管理员*/
);

CREATE TABLE bookBorrow(
borrowID INT KEY AUTO_INCREMENT,
borrowBookID INT(8) NOT NULL,
borrowUserID INT(8) NOT NULL,
borrowTime DATE NOT NULL,
returnWhe TINYINT(1) DEFAULT 0,
/* 0代表未归还*/
returnBefore DATE
);
CREATE TABLE equipBorrow(
borrowID INT KEY AUTO_INCREMENT,
borrowEquipID INT(8) NOT NULL,
borrowUserID INT(8) NOT NULL,
borrowTime DATE NOT NULL,
returnWhe TINYINT(1) DEFAULT 0,
/* 0代表未归还*/
returnBefore DATE,
reservation tINYINT(1) default 0,
/*0表示正在审核，审核未通过*/
reservationText TEXT
);
ALTER TABLE equipBorrow ADD reservationText TEXT;
ALTER TABLE equipBorrow ADD reservaion tINYINT(1) default 0;
ALTER TABLE hopeAdmin CHANGE adminImgSRC adminImgSrc VARCHAR(100) DEFAULT "/img/admin/admin-default.jpg";
ALTER TABLE equipBorrow change reservaion reservation tINYINT(1) default 0;

SELECT borrowBookID,borrowUserID,readerName,readerEmail,bookName,bookHopeID FROM bookBorrow,hopeReader,hopeBook WHERE bookBorrow.borrowBookID=hopeBook.bookID AND bookBorrow.borrowUserID=hopeReader.readerID AND bookBorrow.returnWhe=0 AND DATEDIFF(bookBorrow.returnBefore,CURDATE())=5; 

SELECT borrowBookID,borrowUserID,readerName,readerEmail,bookName,bookHopeID FROM bookBorrow,hopeReader,hopeBook WHERE bookBorrow.borrowBookID=hopeBook.bookID AND bookBorrow.borrowUserID=hopeReader.readerID AND bookBorrow.returnWhe=0 AND DATEDIFF(bookBorrow.returnBefore,CURDATE())=4 AND hopeReader.readerID=7; 


UPDATE equipBorrow set returnWhe=1,reservation=1;
update hopeequip set equipLeft=1;


SELECT readerName,borrowTime,equipName,adminName FROM hopeReader,equipBorrow,hopeEquip,hopeAdmin WHERE equipBorrow.borrowEquipID=hopeEquip.equipID AND equipBorrow.reservation=0 AND hopeEquip.equipAdminID=hopeAdmin.adminID=4;


SELECT readerName,borrowTime,equipName,adminName FROM hopeReader,equipBorrow,hopeEquip,hopeAdmin WHERE equipBorrow.borrowEquipID=hopeEquip.equipID AND equipBorrow.reservation=0 AND equipBorrow.borrowUserID=hopeReader.readerID AND hopeEquip.equipAdminID=hopeAdmin.adminID AND hopeAdmin.adminID=4;