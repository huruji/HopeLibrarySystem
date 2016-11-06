CREATE DATABASE hopeWechat;
/*书籍表*/
CREATE TABLE hopeBook(
bookID INT KEY AUTO_INCREMENT,
bookImgSrc varchar(100) default "/img/book/bookdefault.jpg",
bookName VARCHAR(100) NOT NULL,
bookHopeID VARCHAR(100) NOT NULL UNIQUE,
bookAuthor varchar(100),
bookISBN varchar(100) NOT NULL,
bookPress varchar(100),
bookCate enum("编程类","设计类","摄影类","网管类","人文类","软件教程类","博雅教育类","其他") DEFAULT "编程类",
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
equipLeft tINYINT(1) DEFAULT 1
/*1代表在架上，0代表已借出*/
)

/*读者表*/
CREATE TABLE hopeReader(
readerID INT KEY AUTO_INCREMENT,
readerName VARCHAR(20) NOT NULL UNIQUE,
readerPassword VARCHAR(32) NOT NULL,
readerSex ENUM("男","女") default "男",
readerGroup ENUM('网管组','编程组','设计组','前端组','数码组') DEFAULT "网管组",
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
