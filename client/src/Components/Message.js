import React,{useEffect,useState} from 'react';
import axios from 'axios';
import { useNavigate ,useParams} from "react-router-dom";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useUserAuth } from "../store/userAuth";
import { useRefreshAuth } from "../store/refresh";

import { motion } from 'framer-motion';

import ConversationItem from './ConversationItem';



function Message({darkMode}) {
    const [conversations, setConversations] = useState([]);
  // console.log(conversations)
    const { user, userId } = useUserAuth();
const { refresh } = useRefreshAuth() 
const navigate = useNavigate();
const params = useParams();
const fetch = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };
    // console.log(config)
     await axios.get("http://localhost:8080/chat/", config)
      .then((response) => {
        // console.log("Data refresh in sidebar ", response.data);
        setConversations(response.data);
      })
  }

  useEffect(() => {
    fetch();
  }, [refresh]);
  return (
    <motion.div className="md:basis-3/5 lg:basis-3/4 w-full flex flex-col h-full overflow-auto">
        <div className="flex gap-3 bg-white p-2 m-2 my-4 items-center justify-between rounded-xl basis-1/8 dark:bg-[#111B21]">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2936/2936956.png"
          alt="logo"
          className="w-[4%] p-2"
        />
        <h1 className="dark:text-slate-200 text-lg font-serif">
          Available Users
        </h1>
        <div>
          <IconButton>
            <RefreshIcon
              style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }}
            />
          </IconButton>
        </div>
      </div>
    <div className="bg-white m-2 rounded-xl p-2 h-full flex flex-col gap-2 overflow-y-scroll dark:bg-[#111B21]  dark:scrollbar-thumb-slate-700 scrollbar-thin scrollbar-thumb-slate-300 ">
        {conversations.length && conversations?.map((conversation, index) => {
          // console.log(conversation,'ll')
          return (
            <motion.div
              // key={conversation._id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }} 
              onClick={()=> navigate(`/chat/${conversation._id}&${conversation.isGroupChat ? conversation.chatName : conversation.users[1]._id=== userId ? conversation.users[0].name : conversation.users[1].name}`)}
            >
              <ConversationItem name={`${conversation.isGroupChat===true ? conversation.chatName : conversation.users[1]._id === userId ? conversation.users[0].name : conversation.users[1].name}`} firstLetter={`${conversation.isGroupChat===true ? conversation.chatName[0] : conversation.users[1]._id === userId ? conversation.users[0].name[0] : conversation.users[1].name[0] }` } lastmessage={`${conversation.latestMessage === undefined ? "tap to chat" : conversation.latestMessage.content } `} />
            </motion.div>
          )
         })} 
      </div>
      </motion.div>
  )
}

export default Message