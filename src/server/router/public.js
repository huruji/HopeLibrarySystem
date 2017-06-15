const express=require("express");
const mysql_util=require("./mysql_util");
const crypto=require("crypto");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const url=require("url");
const router=express.Router();

const setSession = require('./../utils/set-session');

router.get("/",function(req,res){
    res.redirect('/user/login');
});
router.get("/logout", function(req, res) {
    setSession(req,{userSign:false,userID:'',adminSign:false,adminID:''});
    res.redirect('/');
});
router.post('/temp/img', function(req, res) {
    let form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    form.uploadDir =path.join("./","public/img/temp");
    form.keepExtensions=true;
    form.maxFieldsSize=2*1024*1024;
    form.parse(req,function(err,fields,files){
        console.log(files);
        console.log(files);
        const extension = files.img.path.substring(files.img.path.lastIndexOf("."));
        const newName="/temp"+Date.now()+extension;
        const newPath=form.uploadDir+newName;
        fs.renameSync(files.img.path,newPath);
        const imgSrc = '/img/temp' + newName;
        res.send({imgSrc});
    });
});



module.exports=router;