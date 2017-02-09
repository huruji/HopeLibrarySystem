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
       const data = setBookData(rows);
       res.json(data);
    });
});
router.get('/book', function(req, res, next) {
    if(req.query.hopeid || req.query.isbn || req.query.cate || req.query.author || req.query.name || req.query.publisher) {
        let data = {code: 400, msg: '请求参数错误'};
        return res.json(data);
    }
    let keys = Object.keys(req.query);
    let error = keys.find((ele) => {
        return !['hopeid','isbn','cate','author','name','publisher'].includes(ele);
    });
    if(error) {
        let data = {code: 400, msg: '请求参数错误'};
        return res.json(data);
    }
    for(let key in req.query) {
        req.query[key] = mysql_util.DBConnection.escape(req.query[key]);
    }
    if(req.query.hopeid) {
        let dataJson = {bookHopeID: req.query.hopeid};
        bookDB.selectItem(dataJson, (rows) => {
            const data = setBookData(rows);
            return res.json(data);
        })
    }
    if(req.query.isbn) {
        let dataJson = {bookISBN: req.query.isbn};
        bookDB.selectItem(dataJson, (rows) => {
            const data = setBookData(rows);
            return res.json(data);
        });
    }
    let dataJson = {};
    if(req.query.cate) {
        dataJson.bookCate = req.query.cate;
    }
    if(req.query.author) {
        dataJson.bookAuthor = req.query.author;
    }
    if(req.query.name) {
        dataJson.bookName = req.query.name;
    }
    if(req.query.publisher) {
        dataJson.bookPress = req.query.publisher;
    }
    bookDB.selectItem(dataJson, (rows) => {
        let data = setBookData(rows);
        res.json(data);
    })
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