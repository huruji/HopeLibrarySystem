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



SELECT borrowBookID,borrowUserID,readerName,readerEmail,bookName,bookHopeID FROM bookBorrow,hopeReader,hopeBook WHERE bookBorrow.borrowBookID=hopeBook.bookID AND bookBorrow.borrowUserID=hopeReader.readerID AND bookBorrow.returnWhe=0 AND DATEDIFF(bookBorrow.returnBefore,CURDATE())=5; 

SELECT borrowBookID,borrowUserID,readerName,readerEmail,bookName,bookHopeID FROM bookBorrow,hopeReader,hopeBook WHERE bookBorrow.borrowBookID=hopeBook.bookID AND bookBorrow.borrowUserID=hopeReader.readerID AND bookBorrow.returnWhe=0 AND DATEDIFF(bookBorrow.returnBefore,CURDATE())=5 AND hopeReader.readerID=7; 