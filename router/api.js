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

router.get('/book/:id', function(req, res, next){
    apiBook.apiBookId(req, res, next);
});
router.get('/book', function(req, res, next) {
    apiBook.apiBookQuery(req, res, next);
});
router.get("book-borrow/:id",function(req, res, next){
  const borrowID = Number.parseInt(req.params.id);
  bookDB.selectMessage(bookID, (rows) => {
    const data = setBorrowData(rows);
    res.json(data);
  });
});



module.exports=router;