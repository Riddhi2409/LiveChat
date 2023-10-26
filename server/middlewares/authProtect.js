const express = require('express')
require('dotenv').config()
const jwt = require('jsonwebtoken');

const User= require('../modals/userModal')

exports.protect = async(req,res,next) =>{
    const testToken = req.headers.authorization;  

    var token;
    if (testToken && testToken.startsWith('Bearer')){
      token=testToken.split(' ')[1];
    }
    if (!token){
      res.status(401).json({message: "User is not logged in"})
    }
    jwt.verify(token,process.env.SECRET_TOKEN,async function(err,decoded){
      if (err){
        return res.status(500).send({ auth: false, message: err }); 
      }
      if (!(await User.findById(decoded.id))){
        return res.status(500).send({ auth: false, message: "user not exixts" })
      }
      res.user= decoded;
      next();
    })
}