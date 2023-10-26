const express=require('express')
const cors=require('cors') 

require('dotenv').config();
const connectdb=require('./mongodb/mongodb');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { Socket } = require('socket.io');


const port=process.env.PORT || 8080;

const app=express();
app.use(express.json({ limit: '50mb' }))
app.use(cors())
app.use('/auth',authRoutes);
app.use('/chat',chatRoutes);
app.use('/message',messageRoutes)

const server = app.listen(port, () => console.log('Server started on port 8080'));

const startServer = async () => {
    try {
      connectdb.connectdb(process.env.MONGO_URL);
      
    } catch (error) {
      console.log(error);
    }
  };

startServer();

app.get('/',(req,res)=>{
    res.send('hello world')
})

const io= require("socket.io")(server,{
  cors: {
    origin: '*'
  },
  pingTimeout: 60000
});

io.on("connection",(socket)=>{
  console.log("socket.io Connection established");

  socket.on("setup",(user)=>{
    socket.join(user);
    socket.emit("connected");
  })

  socket.on("join chat", (room)=>{
    socket.join(room);
  })

  socket.on("newMessage",(newMessageStatus)=>{
    console.log(newMessageStatus)
    var chat = newMessageStatus.chat;
    if (!chat.users){
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user)=>{
      if (user._id === newMessageStatus.sender._id) return;

      socket.in(user._id).emit("message received" , newMessageStatus);  
    })
  })
})