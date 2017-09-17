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

const apiLogin = {
  admin(req, res, next) {
    const password_md5=md5Pass(req.body.password);
    const userName = req.body.username;
    const query = 'SELECT * FROM hopeadmin'
      + ' WHERE adminName='
      + mysql_util.DBConnection.escape(userName)
      + ' AND adminPassword="'
      + password_md5
      + '"';
    adminDB.query(query,(rows) => {
      const admin = rows[0];
      if(rows.length==0){
        const error={
          code:404,
          msg:"用户名或密码错误"
        };
        res.send(error)
      }else{
        res.cookie("adminId",rows[0].adminID,{
          maxAge: 30 * 60 * 1000,
          path: '/',
        });
        const message ={
          code:200,
          msg:"成功",
          userId:rows[0].adminID
        };
        setSession(req,{adminID:admin.adminID,adminSign: true});
        res.json(message);
      }
    });
  },
  user(req, res, next) {
    console.log(123123123);
    const password_md5=md5Pass(req.body.password);
    const userName = req.body.username;
    const query = 'SELECT * FROM hopereader'
      + ' WHERE readerName='
      + mysql_util.DBConnection.escape(userName)
      + 'AND readerPassword= "'
      + password_md5
      + '"';
    userDB.query(query, (rows) => {
      const user = rows[0];
      if(rows.length==0){
        const error={
          code:404,
          message:"用户名或密码错误"
        };
        res.send(error)
      }else {
        res.cookie("userId", rows[0].readerID, {
          maxAge: 30 * 60 * 1000,
          path: '/',
        });
        const message = {
          code: 200,
          message: "成功",
          userId: user.readerID
        };
        setSession(req, {userID: user.readerID, userSign: true});
        res.json(message);
      }
    });
  }
}

module.exports = apiLogin;