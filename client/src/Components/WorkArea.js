import React from "react";
import { useEffect,useRef ,useState} from "react";
import { useParams , useNavigate } from "react-router-dom";
import axios, { all } from 'axios'

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Skeleton from "@mui/material/Skeleton";

import OthersMessage from "./OthersMessage";
import SelfMessage from "./SelfMessage";
import { useUserAuth } from "../store/userAuth";
import { useRefreshAuth } from "../store/refresh";

import {io} from "socket.io-client"

let socket;


function WorkArea({darkMode}) {

  const  ENDPOINT = "http://localhost:8080"


  const navigate = useNavigate();
  const scrollRef = useRef();
  const [allMessages, setAllMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const { refresh ,refreshSidebarFun} = useRefreshAuth();
  const {user,userId} = useUserAuth()
  const [loaded, setloaded] = useState(false);
  const [socketConnectionStatus , setSocketConnectionStatus] = useState(false);
  const [allMessagesCopy , setAllMessagesCopy] = useState([]);
  const params= useParams();
  const [chat_id,chat_name]= params.chatId.split("&");
 
  // console.log(allMessages)
  // const socket = io(ENDPOINT)
  useEffect(()=>{
    socket = io(ENDPOINT)
    socket.emit("setup",userId);
    socket.on("connection",()=>{
      setSocketConnectionStatus(!socketConnectionStatus);
    })
  },[])
  
  const sendMessage = async() => {
    // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    // console.log("SendMessage Fired to", chat_id._id);
    var data = null;
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };
    console.log(messageContent)
    await axios
      .post(
        "http://localhost:8080/message/", 
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then((response ) => {
        data = response.data;
        console.log(data,"daataaa")
        console.log("Message Fired");
      });
      // console.log(data)
      socket.emit("newMessage",data)
  };

  const getAllMessage = async() =>{
    // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    const config = {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      };
      console.log(chat_id)
      chat_id && await axios
        .get(`http://localhost:8080/message/${chat_id}`, config)
        .then(({ data }) => {
          setAllMessages(data);
          setloaded(true);
          // console.log("Data from Acess Chat API ", data)
          socket.emit("join chat", chat_id)
        });
        setAllMessagesCopy(allMessages)
  }

  useEffect(() => {
    // scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    getAllMessage()
  }, [refresh,chat_id,user]);

  useEffect(()=>{
    socket.on("message received",(newMessage)=>{
      console.log(allMessagesCopy,"inside use")
      if ((!allMessagesCopy || allMessagesCopy._id) === newMessage._id){
          console.log(newMessage , "inside if")
      }else{
        console.log(newMessage)
        setAllMessages([...allMessages , newMessage])
      }
    })
  })

 
  

 
 if (!loaded){
  return (
    <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
  )
 }
  return (
    <div className="md:basis-3/5 lg:basis-3/4 w-full flex flex-col h-full">
      <div className="flex gap-3 bg-white p-2 m-2 my-4 items-center rounded-xl basis-1/8 dark:bg-[#111B21]"  >
        <h1 className="w-[2rem] h-[2rem] rounded-full text-white bg-gray-300 flex items-center justify-center text-lg font-bold dark:bg-slate-700">
         { chat_name[0]}
        </h1>
        <div className="flex flex-col w-full text-slate-500">
          <p className="font-bold text-lg">{chat_name}</p>
          <p className="text-sm">today</p>
        </div>
        <div>
          <IconButton onClick={async()=>{
              const config = {
                headers: {
                  Authorization: `Bearer ${user}`,
                },
              };
              // console.log(chat_id,userId,"pppp")
              await axios.post("http://localhost:8080/chat/deleteChat",{
                chatId: chat_id,
                userId: userId
              },config).then((response)=> {
                // console.log(response)
              })
              refreshSidebarFun()
              console.log("deleted")
              navigate("/");
          }} >
            <DeleteIcon  style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }}/>
          </IconButton>
        </div>
      </div>
      <div className="bg-white rounded-xl p-2 m-2 basis-3/4  overflow-y-scroll dark:bg-[#111B21] dark:scrollbar-thumb-slate-700 scrollbar-thin scrollbar-thumb-slate-300 flex flex-col-reverse" >
        {/* <OthersMessage />
        <SelfMessage />
        <OthersMessage />
        <SelfMessage />
        <OthersMessage />
        <SelfMessage />
        <OthersMessage />
        <SelfMessage /> */}
        {allMessages.slice(0).reverse().map((message,index)=>{
           const sender = message.sender;
           const self_id = userId;
          //  console.log(message,"pp")
          //  console.log(sender._id,userId,"ppp")
           if (sender._id === userId) {
             // console.log("I sent it ");
             return (
              <div key={index} ref={scrollRef}>
             <SelfMessage props={message.content}  name={sender.name}/>
             </div>);
           } else {
             // console.log("Someone Sent it");
             return (
              <div key={index} ref={scrollRef}>
             <OthersMessage props={message.content}  name={sender.name}/>
             </div>
             );
           }
        })}
      </div>
      <div className=" flex bg-white basis-1/8  rounded-xl p-2 m-2 gap-2 dark:bg-[#111B21]">
        <input 
          type="text"
          placeholder="Type a message"
          className="w-[95%] outline-none dark:bg-[#111B21] dark:text-slate-300"
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
          value={messageContent}
          onKeyDown={(event) => {
            if (event.code == "Enter") {
              // console.log(event);
              sendMessage();
              setMessageContent("");
              // setRefresh(!refresh);
              refreshSidebarFun()
            }
          }}
        />
        <IconButton onClick={() => {
              sendMessage();
              refreshSidebarFun()
            }}>
          <SendIcon style={{color: `${darkMode ? "rgb(148 163 184)" : ""} `}}/>
        </IconButton>
      </div>
    </div>
  );
}

export default WorkArea;
