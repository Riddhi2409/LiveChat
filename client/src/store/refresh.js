import React from "react";
import { useState, useContext, createContext } from "react";

const refreshContext = createContext();

const RefreshProvider = ({children}) =>{
    const [refresh,setRefresh] = useState(true);

    const refreshSidebarFun = () => {
        setRefresh((prev)=>!prev);
    }

    return (
        <refreshContext.Provider value = {{refresh, refreshSidebarFun}} >
            {children}
        </refreshContext.Provider>
    )
}

function useRefreshAuth() {
    return useContext(refreshContext);
}

export {refreshContext , RefreshProvider , useRefreshAuth};