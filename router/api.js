const express=require("express");
const mysql_util=require("./mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const url=require("url");
const router=express.Router();

const setSession = require('./../utils/set-session');
const md5Pass = require('./../utils/md5-pass');
const hopeDB = require('./../utils/hopeDB.js');
const [adminDB, userDB, bookDB, equipDB] = [hopeDB.adminDB, hopeDB.userDB, hopeDB.bookDB, hopeDB.equipDB];

router.get('/book/:id', function(req, res, next) {
    const bookID = Number.parseInt(req.params.id);
    bookDB.selectMessage(bookID, (rows) => {
       const books = rows;
       const data = setBookData(books);
       res.json(data);
    });
});

function setBookData(bookArr) {
    let data = {};
    if(bookArr.length < 1) {
        return {code:404,msg:'请求的资源不存在'}
    } else if(bookArr.length == 1) {
        return {
            id: bookArr[0].book,
            cate: bookArr[0].bookCate,
            hopeid: bookArr[0].bookHopeID,
            left: bookArr[0].bookLeft,
            imgsrc:bookArr[0].bookImgSrc,
            name:bookArr[0].bookName,
            author:bookArr[0].bookAuthor,
            isbn:bookArr[0].bookISBN,
            publisher:bookArr[0].bookPress
        }
    }else{
        data.totals = bookArr.length;
        data.books = [];
        bookArr.forEach((ele) => {
            let book = {
                id: ele.book,
                cate: ele.bookCate,
                hopeid: ele.bookHopeID,
                left: ele.bookLeft,
                imgsrc: ele.bookImgSrc,
                name: ele.bookName,
                author: ele.bookAuthor,
                isbn: ele.bookISBN,
                publisher: ele.bookPress
            };
            data.books.push(book);
        });
        return data;
    }
}

module.exports=router;