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
const [adminDB, userDB, bookDB, equipDB, borrowDB] = [hopeDB.adminDB, hopeDB.userDB, hopeDB.bookDB, hopeDB.equipDB, hopeDB.borrowDB];
const apiBook = require('./api/api-book');
const apiBookBorrow = require('./api/api-book-borrow');
router.get('*',function(req, res,next){
  res.header({'Access-Control-Allow-Origin':'*'});
  next();
});
router.get('/book/:id', function(req, res, next){
    apiBook.apiBookId(req, res, next);
});
router.get('/book', function(req, res, next) {
    apiBook.apiBookQuery(req, res, next);
});
router.get('/book-count',function(req, res, next) {
    apiBook.apiBookCount(req,res, next);
});
router.get("/book-borrow/:id",function(req, res, next){
  apiBookBorrow.apiBookBorrowId(req, res, next);
});
router.get('/book-borrow',function(req, res, next){
  apiBookBorrow.apiBookBorrowQuery(req, res, next)
});
router.get('/book-borrow-count', function(req, res, next) {
  apiBookBorrow.apiBookBorrowCount(req, res, next);
});



module.exports=router;