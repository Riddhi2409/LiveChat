import React, { useState, useEffect } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import { Backdrop } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";

import { useUserAuth } from "../store/userAuth";
import { useRefreshAuth } from "../store/refresh";

function Groups({ darkMode }) {
  const { user ,userId} = useUserAuth();
  const { refresh, refreshSidebarFun } = useRefreshAuth();
  const [groups, SetGroups] = useState([]);
  const [loading,setLoading] = useState(false);

  // console.log(groups,"pp")

  const fecthUsers = async () => {
    // setLoading(!users)
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };
    await axios
    .get("http://localhost:8080/chat/fetchGroups", config)
    .then((response) => {
      // console.log("Group Data from API ", response.data);
      SetGroups(response.data);
    });
  };

  // console.log(groups)

  useEffect(() => {
    fecthUsers();
  }, [refresh]);
  return (
    <AnimatePresence>
    <motion.div className="md:basis-3/5 lg:basis-3/4 w-full flex flex-col h-full" initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          duration: "0.3",
        }}>
      <div className="flex gap-3 bg-white p-2 m-2 my-4 items-center justify-between rounded-xl basis-1/8 dark:bg-[#111B21]">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2936/2936956.png"
          alt="logo"
          className="w-[4%] p-2"
        />
        <h1 className="dark:text-slate-200 text-lg font-serif">
          Available Groups
        </h1>
        <div>
          <IconButton onClick={refreshSidebarFun}>
            <RefreshIcon
              style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }}
            />
          </IconButton>
        </div>
      </div>
      <div className="bg-white rounded-xl p-1 mx-2 flex dark:bg-[#111B21] max-md:hidden">
        <IconButton>
          <SearchIcon className="dark:text-white f" />
        </IconButton>
        <input
          type="text"
          placeholder="search"
          className=" outline-none w-full text-lg dark:bg-[#111B21] dark:text-slate-300"
        />
      </div>
      <div className="bg-white m-2 rounded-xl p-2 h-full flex flex-col gap-2 overflow-y-scroll dark:bg-[#111B21]  dark:scrollbar-thumb-slate-700 scrollbar-thin scrollbar-thumb-slate-300  ">
      <Backdrop
         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
         open={loading}>
          <CircularProgress color="inherit" />
         </Backdrop>
        {groups.map((userr, index) => {
          return (
            <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
              className=" flex w-full  p-2 items-center gap-3 border-b-2 dark:border-slate-500 shadow-inner rounded-xl shadow-slate-400 "
              key={userr._id}
              onClick={() => {
                // console.log("Creating chat with ", userr);
                const config = {
                  headers: {
                    Authorization: `Bearer ${user}`,
                  },
                };
                 axios.put(
                  "http://localhost:8080/chat/addSelfToGroup",
                  {
                    userId: userId,
                    chatId: userr._id

                  },
                  config
                ).then((response)=>{
                  // console.log(response,"popp")
                })
                refreshSidebarFun();
              }}
            >
              <h1 className="w-[2rem] h-[2rem] rounded-full text-white bg-gray-300 flex items-center justify-center text-lg font-bold dark:bg-slate-700 ">
                {userr.chatName[0]}
              </h1>
              <p className="font-bold text-lg text-slate-500">{userr.chatName}</p>
            </motion.div>
          );
        // console.log(userr)
        })} 
        
      </div> 
    </motion.div>  
    </AnimatePresence>
  );
}

export default Groups;
