const mongoose = require("mongoose");

const meassageModal = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true,
      },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
},
{
    timeStamp: true
});

module.exports=mongoose.model('Message',meassageModal);