import { IconButton } from '@mui/material'
import React,{useState} from 'react'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useUserAuth } from '../store/userAuth';

function CreateGroups({darkMode}) {
  const [open, setOpen] = React.useState(false);
  const [groupName, setGroupName] = useState("");
  const {user,userId} = useUserAuth();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createGroup = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };

    axios.post(
      "http://localhost:8080/chat/createGroup",
      {
        name: groupName,
        users: [userId],
        user: userId
      },
      config
    );
    // nav("/app/groups");
  };

  return (
    <>
    <div>
    <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to create a Group Named " + groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a create group in which you will be the admin and
              other will be able to join this group.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
    </div>
    <div className='basis-3/4 w-full flex h-full justify-center items-center'>
    <div className=' rounded-xl p-1 mx-2 flex h-fit justify-center items-center w-full bg-white dark:bg-[#111B21]'>
        <input placeholder='Enter Group Name' className=' w-[95%] outline-none dark:bg-[#111B21] dark:text-slate-300' onChange={(e) => {
            setGroupName(e.target.value);
          }}/>
        <IconButton onClick={handleClickOpen}>
            <DoneOutlineIcon  style={{ color: `${darkMode ? "rgb(148 163 184)" : ""} ` }} />
        </IconButton>
    </div>
    </div>
    </>
  )
}

export default CreateGroups