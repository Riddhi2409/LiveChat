import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from 'framer-motion'

import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import NightlightIcon from "@mui/icons-material/Nightlight";
import SearchIcon from '@mui/icons-material/Search';
import LightModeIcon from '@mui/icons-material/LightMode';
import TextsmsIcon from '@mui/icons-material/Textsms';

import ConversationItem from "./ConversationItem";
import { useUserAuth } from "../store/userAuth";
import { useRefreshAuth } from "../store/refresh";


function Sidebar({ darkMode, setDarkMode }) {
  const [conversations, setConversations] = useState([]);
  

  const { user, userId } = useUserAuth();
  const { refresh } = useRefreshAuth() 

  const navigate = useNavigate();
  const params = useParams();

  const [chat_id, chat_name] = [];
  if (params.chatId) {

    [chat_id, chat_name] = params?.chatId?.split("&");
  }

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
    // console.log("Sidebar : ", user);
    fetch();

  }, [refresh]);



  const handleTheme = () => {
    setDarkMode((prev) => !prev)
    // console.log(darkMode)

  }

  if (darkMode) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }

  return (
    <div className=" md:basis-2/5 lg:basis-1/4 w-fit flex flex-col gap-2 h-full max-md:justify-center ">
      <div className="flex  md:flex-row flex-col md:justify-between bg-white p-2 m-2 rounded-xl my-4 mb-4 dark:bg-[#111B21] dark:fill-white max-md:h-full justify-center max-md:w-fit">
        <Link to='/'>
          <IconButton  >
            <AccountCircleIcon style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }} />
          </IconButton>
        </Link>
        <Link to='/message' className="md:hidden">
        <IconButton >
          <TextsmsIcon style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }}/>
        </IconButton>
        </Link>
        <div className="flex md:flex-row flex-col">
          <Link to='/availableUsers'>
            <IconButton>
              <PersonAddIcon style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }} />
            </IconButton>
          </Link>
          <Link to="/availableGroups" >
          <IconButton>
            <GroupAddIcon style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }} />
          </IconButton>
          </Link>
          <Link to='/creategroup'>
            <IconButton>
              <AddCircleIcon style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }} />
            </IconButton>
          </Link>
          <IconButton onClick={handleTheme}>
            {!darkMode ? <NightlightIcon /> : <LightModeIcon style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }} />}
          </IconButton>
        </div>
      </div>
      <div className="bg-white rounded-xl p-1 mx-2 flex dark:bg-[#111B21] max-md:hidden">
        <IconButton>
          <SearchIcon className="dark:text-white f" />
        </IconButton>
        <input type="text" placeholder="search" className=" outline-none w-full text-lg dark:bg-[#111B21] dark:text-slate-300" />
      </div>
      <div className="bg-white m-2 rounded-xl p-2 h-full flex flex-col gap-2 overflow-y-scroll dark:bg-[#111B21]  dark:scrollbar-thumb-slate-700 scrollbar-thin scrollbar-thumb-slate-300 max-md:hidden ">
        {conversations.length && conversations?.map((conversation, index) => {
          // console.log(conversation,'ll')
          return (
            <motion.div
              // key={conversation._id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }} 
              onClick={()=>navigate(`chat/${conversation._id}&${conversation.isGroupChat ? conversation.chatName : conversation.users[1]._id=== userId ? conversation.users[0].name : conversation.users[1].name}`)}
            >
              <ConversationItem name={`${conversation.isGroupChat===true ? conversation.chatName : conversation.users[1]._id === userId ? conversation.users[0].name : conversation.users[1].name}`} firstLetter={`${conversation.isGroupChat===true ? conversation.chatName[0] : conversation.users[1]._id === userId ? conversation.users[0].name[0] : conversation.users[1].name[0] }` } lastmessage={`${conversation.latestMessage === undefined ? "tap to chat" : conversation.latestMessage.content } `} />
            </motion.div>
          )
         })} 
      </div>
    </div>
  );
}

export default Sidebar;
 