const express= require('express');
const mongoose = require('mongoose')

const User = require('../modals/userModal');
const Chat = require('../modals/chatModel');
const Message = require('../modals/messageModal')

//for one to one chat creation
const accessChat = async(req,res) =>{
    const  { userId } =req.body;
    console.log("hh")
    if (!userId){
        console.log("UserId param not sent with request");
        return res.status(400).json({message: "UserId param not sent with request"});
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: { $elemMatch: { $eq: res.user.id}}},
            { users: { $elemMatch: { $eq: userId } } }
        ],
    })
        .populate("users","-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email"
    });

    if (isChat.length > 0){
        console.log(isChat);
        res.status(200).json({message: isChat[0]});
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [res.user.id, userId],
        }
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        }catch (error) {
            res.status(400);
            throw new Error(error.message);
          }
    }

}

const fetchChats = async(req,res) => {
    try {
        console.log("Fetch Chats API : ", res.user)
        Chat.find({users: {$elemMatch: {$eq: res.user.id}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async(results)=>{
                results = await User.populate(results,{
                    path: "latestMessage.sender",
                    select: "name email",
                });
                res.status(200).json(results)
            })
        }catch (error){
                res.status(400);
                // throw new Error(error.message);
            }
    }

const fetchGroups = async(req,res) => {
    try {
        const allGroups = await Chat.where("isGroupChat").equals(true);
        res.status(200).send(allGroups);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
}

const createGroupChat = async (req, res) => {
  console.log(req.body)
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Data is insufficient" });
    }
  
    // var users = JSON.parse(req.body.users);
    // console.log("chatController/createGroups : ", req);
    // users.push(req.user);
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name, 
        users: req.body.users,
        isGroupChat: true,  
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400).json({message: error});
    //   throw new Error(error.message);
    }
  }

  const groupExit = async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId }, 
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404).json({message: "Chat Not Found"});
    } else {
      res.json(removed);
    }
  }

  const addSelfToGroups = async(req,res) => {
    console.log(req.body);
    const {chatId , userId} = req.body;
    
    const added = await Chat.findByIdAndUpdate(chatId,{
      $addToSet: {users: userId}
    },{
      new: true
    }).populate("users","-passward")
      .populate("groupAdmin","-password");

      if (!added){
        res.status(404).json({message: "chat not found"})
      }
      else {
        res.json(added)
      }
  }

  const deleteChat = async(req,res) => {
    const {chatId, userId} = req.body;
    console.log(req.body)
    const existingChat = await Chat.findById(chatId)

    if (existingChat){
      console.log(existingChat)
      if (existingChat.isGroupChat){
 

        const removed = await Chat.findByIdAndUpdate(
          chatId,
          {
            $pull: { users: userId }, 
          },
          {
            new: true,
          }
        )
          .populate("users", "-password")
          .populate("groupAdmin", "-password");

          if (!removed) {
            res.status(404).json({message: "Chat Not Found"});
          } else {
            res.json(removed);
          }

      }
      else {
        const removingMessage = await Message.deleteMany({chat: chatId})

        console.log(removingMessage)

        const removingChat = await Chat.deleteOne({_id: chatId});
        res.status(200).json({message: "chat deleted"})
      }
    }
    else {
      console.log("not exist")
      res.status(404).json({message: "chat not exist"})
    }

  }

  module.exports = {
    accessChat,
    fetchChats,
    fetchGroups,
    createGroupChat,
    groupExit,
    addSelfToGroups,
    deleteChat
  };
  