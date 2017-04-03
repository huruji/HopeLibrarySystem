const express=require("express");
const mysql_util=require("./../mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const url=require("url");
const hopeDB = require('./../../utils/hopeDB.js');
const bookDB = hopeDB.bookDB;

const apiBook = {
  apiBookId: function(req, res, next) {
    const bookID = Number.parseInt(req.params.id);
    bookDB.selectMessage(bookID, (rows) => {
      const data = setBookData(rows);
      res.json(data);
    });
  },
  apiBookQuery: function(req, res, next){
    let books;
    let keys = Object.keys(req.query);
    if(keys.length===0) {
      const data = {code: 400, msg: '请求参数错误'};
      return res.json(data);
    }
    console.log('req.query1:' + JSON.stringify(req.query));
    let error = keys.find((ele) => {
      return !['hopeid','isbn','cate','author','name','publisher'].includes(ele);
    });
    if(error) {
      const data = {code: 400, msg: '请求参数错误'};
      return res.json(data);
    }
    for(let key in req.query) {
      req.query[key] = mysql_util.DBConnection.escape(req.query[key]).replace(/(^')|('$)/g,'');
    }
    if(req.query.hopeid) {
      let dataJson = {bookHopeID: req.query.hopeid};
      bookDB.selectItem(dataJson, (rows) => {
        const data = setBookData(rows);
        res.json(data);
      });
    }else if(req.query.isbn) {
      let dataJson = {bookISBN: req.query.isbn};
      bookDB.selectItem(dataJson, (rows) => {
        const data = setBookData(rows);
        res.json(data);
      });
    }else {
      let dataJson = {};
      if (req.query.cate) {
        dataJson.bookCate = req.query.cate;
      }
      if (req.query.author) {
        dataJson.bookAuthor = req.query.author;
        console.log('datajson:' + JSON.stringify(dataJson));
      }
      if (req.query.name) {
        dataJson.bookName = req.query.name;
      }
      if (req.query.publisher) {
        dataJson.bookPress = req.query.publisher;
      }
      bookDB.selectItem(dataJson, (rows) => {
        const data = setBookData(rows);
        res.json(data);
      });
    }
  }
};
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

module.exports = apiBook;