const express=require("express");
const mysql_util=require("./../mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const url=require("url");
const hopeDB = require('./../../utils/hopeDB.js');
const bookDB = hopeDB.bookDB;
const borrowDB = hopeDB.borrowDB;
const host = require('./../../config').host;

const apiBook = {
  apiBookId: function(req, res, next) {
    const bookID = Number.parseInt(req.params.id);
    bookDB.selectMessage(bookID, (rows) => {
      const data = setBookData(rows);
      res.json(data);
    });
  },
  /*apiBookQuery: function(req, res, next){
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
      bookDB.orderItems('bookLeft DESC,bookID DESC', 0, 20, (rows) => {
        const book = setBookCountData(rows);
        res.json(book);
        return res.json(book);
      });
      /!*const data = {code: 400, msg: '请求参数错误'};
      return res.json(data);*!/
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
        if(req.query.cate.toLowerCase() !== 'all') {
          dataJson.bookCate = req.query.cate;
        }
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
  },*/
  apiBookCount: function(req, res, next) {
    let keys = Object.keys(req.query);
    if(keys.length === 0){
      bookDB.countItemsGroup(null, (rows) => {
        const data = setBookCountData(rows);
        res.json(data);
      });
    } else{
      let error = keys.find((ele) => {
        return !['left'].includes(ele);
      });
      if(error) {
        const data = {code: 400, msg: '请求参数错误'};
        return res.json(data);
      }
      bookDB.countItemsGroup(req.query.left, (rows) => {
          const data = setBookCountData(rows);
          res.json(data);
      });
    }
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
  },
  apiReturnBook: function(req, res, next) {
    if(!req.session.userID || !req.session.userSign){
      return res.json({
        code: 401,
        msg: '访问无权限'
      });
    }
    const [bookID, borrowID] = [req.body.bookID, req.body.borrowID];
    bookDB.selectMessage(bookID, (rows) => {
      const book = rows[0];
      const bookLeft = book.bookLeft + 1;
      const setDataJson = {bookLeft};
      bookDB.updateMessage(bookID, setDataJson, (message) => {
        const setDataJson = {
          returnWhe: 1
        };
        borrowDB.updateMessage(borrowID, setDataJson, (message) => {
          res.json({
            code: 200,
            msg: message
          });
        }, '归还成功')
      });
    });
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