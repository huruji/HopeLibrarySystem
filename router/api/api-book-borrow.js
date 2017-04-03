const express=require("express");
const mysql_util=require("./../mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const url=require("url");
const hopeDB = require('./../../utils/hopeDB.js');
const borrowDB = hopeDB.borrowDB;

const apiBookBorrow = {
  apiBookBorrowId: function(req, res, next) {
    const borrowID = Number.parseInt(req.params.id);
    borrowDB.selectMessage(borrowID, (rows) => {
      const data = setBorrowData(rows);
      res.json(data);
    });
  },
  apiBookBorrowQuery: function(req, res, next){
    let keys = Object.keys(req.query);
    if(keys.length===0) {
      const data = {code: 400, msg: '请求参数错误'};
      return res.json(data);
    }
    console.log('req.query1:' + JSON.stringify(req.query));
    let error = keys.find((ele) => {
      return !['id','book','reader','time','return','timeBefore','timeAfter'].includes(ele);
    });
    if(error) {
      const data = {code: 400, msg: '请求参数错误'};
      return res.json(data);
    }
    if(req.query.return){
      req.query.return = req.query.return === true ? 1 : 0;
    }
    for(let key in req.query) {
      req.query[key] = mysql_util.DBConnection.escape(req.query[key]).replace(/(^')|('$)/g,'');
    }
    if(req.query.id) {
      const borrowID = Number.parseInt(req.query.id);
      borrowDB.selectMessage(borrowID, (rows) => {
        const data = setBorrowData(rows);
        res.json(data);
      });
    }else if(req.query.book){
      const book = req.query.book;
      borrowDB.selectItemsByBook(book, (rows) => {
        const data = setBorrowData(rows);
        res.json(data);
      })
    } else{
      let dataJson = {};
      if (req.query.time) {
        dataJson.borrowTime = req.query.time;
      }
      if (req.query.reader) {
        dataJson.readerName = req.query.reader;
        console.log('datajson:' + JSON.stringify(dataJson));
      }
      if (req.query.return) {
        dataJson.returnWhe = req.query.return;
      }
      if(req.query.timeBefore) {
        dataJson.timeBefore = req.query.timeBefore;
      }
      if(req.query.timeAfter){
        dataJson.timeAfter = req.query.timeAfter;
      }
      borrowDB.selectItemsByQuery(dataJson, (rows) => {
        const data = setBorrowData(rows);
        res.json(data);
      });
    }
  },
  apiBookBorrowCount: function(req, res, next){
    let keys = Object.keys(req.query);
    if(keys.length===0) {
      borrowDB.countItems(null, (rows) => {
        const data = setBorrowData(rows);
        res.json(data);
      });
      return res.json(data);
    }
    let error = keys.find((ele) => {
      return !['timeAfter','timeBefore'].includes(ele);
    });
    if(error) {
      const data = {code: 400, msg: '请求参数错误'};
      return res.json(data);
    }
    let dataJson = {};
    if(req.query.timeBefore) {
      dataJson.timeBefore = req.query.timeBefore;
    }
    if(req.query.timeAfter){
      dataJson.timeAfter = req.query.timeAfter;
    }
    borrowDB.countItems(dataJson, (rows) => {
      const data = setBorrowData(rows);
      res.json(data);
    });
  }
};
function setBorrowData(arr) {
  let data = {};
  if(arr.length < 1) {
    return {code:404,msg:'请求的资源不存在'}
  } else if(arr.length == 1) {
    return {
      id: arr[0].borrowID,
      book: arr[0].bookName,
      reader: arr[0].readerName,
      time: arr[0].borrowTime,
      return: arr[0].returnWhe != 0
    }
  }else{
    data.totals = arr.length;
    data.data = [];
    arr.forEach((ele) => {
      let elem = {
        id: ele.borrowID,
        book: ele.bookName,
        reader: ele.readerName,
        time: ele.borrowTime,
        return: ele.returnWhe != 0
      };
      data.data.push(elem);
    });
    return data;
  }
}

module.exports = apiBookBorrow;