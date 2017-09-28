const express=require("express");
const mysql_util=require("./../mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const url=require("url");
const hopeDB = require('./../../utils/hopeDB.js');
const bookDB = hopeDB.bookDB;
const host = require('./../../config').host;

const apiEquip = {
  apiBookId: function(req, res, next) {
    const bookID = Number.parseInt(req.params.id);
    bookDB.selectMessage(bookID, (rows) => {
      const data = setBookData(rows);
      res.json(data);
    });
  },
  apiBookQuery: function(req, res, next) {
    const query = 'SELECT bookCate FROM hopebook GROUP BY bookCate';
    bookDB.query(query, (rows) => {
      const bookCate = [];
      rows.forEach(function(ele) {
        bookCate.push(ele.bookCate);
      });
      const start = req.query.start || 0;
      const end = start + 20;
      if(req.query.cate && req.query.cate !== '全部') {
        const query = `SELECT * from hopebook WHERE bookCate='${req.query.cate}' ORDER BY bookLeft DESC,bookID DESC LIMIT ${start},${20}`;
        bookDB.query(query, (rows) => {
          return res.json(setBookData(rows));
        })
      } else {
        bookDB.orderItems('bookLeft DESC,bookID DESC', start, 20, (rows) => {
          return res.json(setBookData(rows));
        });
      }
    })
  }
};
function setBookCountData(bookArr){
  if(bookArr.length < 1){
    return {code:404,msg:'请求的资源不存在'}
  } else{
    let data = {};
    data.totals = bookArr.length;
    data.data = [];
    bookArr.forEach((ele) => {
      let cate = {
        name: ele.cate,
        count: ele.count
      };
      data.data.push(cate);
    });
    return data;
  }
}
function setBookData(bookArr) {
  let data = {};
  if(bookArr.length < 1) {
    return {code:404,msg:'请求的资源不存在'}
  } else if(bookArr.length === 1) {
    return {
      id: bookArr[0].book,
      cate: bookArr[0].bookCate,
      hopeid: bookArr[0].bookHopeID,
      left: bookArr[0].bookLeft,
      imgsrc:host + bookArr[0].bookImgSrc,
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
        imgsrc: host + ele.bookImgSrc,
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