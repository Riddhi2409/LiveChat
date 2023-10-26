import React,{useState} from "react";
import './App.css';

import MainContainer from "./Components/MainContainer";
import Login from "./Components/Login";
import { useUserAuth } from "./store/userAuth";

function App() {
  const [darkMode,setDarkMode]=useState(true);
  const {isAuthen} = useUserAuth();
  return (
    <div className="flex items-center justify-center w-screen h-screen dark:bg-[#111B21] ">
      {isAuthen ?  <MainContainer darkMode={darkMode} setDarkMode={setDarkMode}/> : <Login />}
      {/* <Login /> */}
      {/* <MainContainer darkMode={darkMode} setDarkMode={setDarkMode}/> */}
    </div>
  );
}

export default App;
