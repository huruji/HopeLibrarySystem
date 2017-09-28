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
const apiLogin = require('./api/api-login');
const apiUser = require('./api/api-user');
router.get('*',function(req, res,next){
  console.log('apiget');
  console.log(req.hostname);
  res.header({'Access-Control-Allow-Origin': req.headers.origin,"Access-Control-Allow-Credentials": "true"});
  next();
});
router.post('*',function(req, res,next){
  console.log('apipost');
  res.header({'Access-Control-Allow-Origin':req.headers.origin,"Access-Control-Allow-Credentials": "true"});
  next();
});
router.options('*', function(req, res, next) {
  res.header({'Access-Control-Allow-Origin':req.headers.origin,"Access-Control-Allow-Credentials": "true"});
  next();
});
router.get('/book/:id', function(req, res, next){
    apiBook.apiBookId(req, res, next);
});
router.get('/book', function(req, res, next) {
    apiBook.apiBookQuery(req, res, next);
});
router.post('/book/return', function(req, res, next) {
    apiBook.apiReturnBook(req, res, next);
});
router.get('/book-count',function(req, res, next) {
    apiBook.apiBookCount(req,res, next);
});
router.get('/user/book/borrow', function(req, res, next) {
  apiUser.getBookBorrow(req, res, next);
});
router.get('/user/equip/reservation', function(req, res, next) {
  apiUser.getEquipReservation(req, res, next);
});
router.get('/user/info', function(req, res, next) {
  apiUser.getUserInfo(req, res, next);
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
router.post('/admin/login', function(req, res, next) {
  apiLogin.admin(req,res,next);
});
router.post('/user/login', function(req, res, next) {
  apiLogin.user(req, res, next);
})


module.exports=router;