const User = require('../modals/userModal');
const Message = require('../modals/messageModal');
const Chat = require('../modals/chatModel');

const allMessages = async (req,res) =>{
    try {
      console.log( req.params.chatId)
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "name email")
          .populate("receiver")
          .populate("chat");
        res.json(messages);
      } catch (error) {
        res.status(400);
        // throw new Error(error.message);
      }
}

const sendMessage = async(req,res) => {
    const { content, chatId } = req.body;
    console.log(req.body)

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: res.user.id,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "name pic");
      message = await message.populate("chat");
      // message = await message.populate("chat.latestMessage")
      message = await message.populate("receiver");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name email",
      });
      message = await Message.populate(message, {
        path: "chat.latestMessage",
        select: "chat"
      })
      
      const ol=await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
      console.log(message);
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
      return res.status(400).json({message: error}) 
    //   throw new Error(error.message);
    }
}

module.exports = { allMessages, sendMessage };