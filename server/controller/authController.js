const express = require('express');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const User = require('../modals/userModal');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_TOKEN);
  };

  exports.signUp = async (req, res) => {
    console.log(req.body)
    const { name, email, password, confirmPassword } = req.body;
  
    if (await User.findOne({ email })) {
      console.log("error")
      return res.status(400).json({ success: false, error: "user already exist" });
    } 
      try {
        const newUser = await User.create({
          name,
          email,
          password,
          confirmPassword,
        });
        const token = signToken(newUser._id);
        return res.status(200).json({ token: token, success: true ,_id: newUser._id});
      } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false ,message: "can't connect try again"});
      }
    
  };

  exports.Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "enter both email and password" });
    } else {
      const currentUser = await User.findOne({ email }).select("+password");
      if (
        !currentUser ||
        !(await currentUser.comparePasswordIndb(
          password,
          currentUser.password
        ))
      ) {
        res.status(400).json({ error: "enter valid email and password" });
      } else {
        const token = signToken(currentUser._id);
        res.status(200).json({ token: token, success: true , _id:currentUser._id , name: currentUser.name});
      }
    }
  };

  exports.getAllUser = async(req,res) => {
    const id = res.user.id;
    const users = await User.find({_id: {$ne: id}});
    res.json({success: true , users});
}