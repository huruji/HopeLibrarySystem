const express=require("express");
const mysql_util=require("./../mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const url=require("url");
const router=express.Router();

const setSession = require('./../../utils/set-session');
const md5Pass = require('./../../utils/md5-pass');
const hopeDB = require('./../../utils/hopeDB.js');
const [adminDB, userDB, bookDB, equipDB] = [hopeDB.adminDB, hopeDB.userDB, hopeDB.bookDB, hopeDB.equipDB];

const host = require('./../../config').host;
const userApi = {
  getBookBorrow(req, res, next){
    console.log('req');
    console.log(req.session);
    console.log('userID', req.session.userID);
    console.log(req.cookies);
    if(!req.session.userID || !req.session.userSign){
      return res.json({
        code: 401,
        msg: '访问无权限'
      });
    }
    const userID = req.session.userID;
    userDB.selectMessage(userID, (rows) => {
      const user = rows[0];
      const [userName, userImg, userPermission] = [user.readerName, user.userImgSrc, 'user'];
      const query = "SELECT bookName,borrowTime,bookID,borrowID,bookImgSrc,returnBefore"
        + " FROM hopebook,hopereader,bookborrow"
        + " WHERE hopebook.bookID=bookborrow.borrowBookID"
        + " AND hopereader.readerID=bookborrow.borrowUserID"
        + " AND returnWhe=0"
        + " AND readerID="
        + userID;
      userDB.query(query, (rows) => {
        const book = rows;
        for(let i=0,max=book.length;i<max;i++){
          book[i].bookImgSrc = host + book[i].bookImgSrc;
          book[i].returnBefore=book[i].returnBefore.getFullYear()+"-"+(parseInt(book[i].returnBefore.getMonth())+1)+"-"+book[i].returnBefore.getDate();
          book[i].borrowTime=book[i].borrowTime.getFullYear()+"-"+(parseInt(book[i].borrowTime.getMonth())+1)+"-"+book[i].borrowTime.getDate();
        }

        setSession(req, {userID: user.readerID, userSign: true});
        res.json({
          code: 200,
          msg: '成功',
          data: book
        })
      })
    });
  }
}

module.exports = userApi;