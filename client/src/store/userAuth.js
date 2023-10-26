import React from "react";
import { useState, useContext, createContext } from "react";
import axios from "axios";

const authContext = createContext();

const AuthProvider = ({children}) =>{
    const [isAuthen,setIsAuthen]=useState(false);
    const [user,setUser]=useState(null);
    const [userId,setUserId]=useState(null)
    const [loading,setLoading] = useState(false);
    const [userName, setUserName] = useState("");

    const Login =async (data) =>{
        setLoading(true)
        await axios.post('http://localhost:8080/auth/login',{...data})
      .then((response) => {
        console.log(response)
        setUser(response.data.token);
        setIsAuthen(true);
        setUserId(response.data._id)
        setUserName(response.data.name)
      })
      .catch((err) => {
        alert(err.response.data.error)
        console.log(err); 
      })
      setLoading(false)
    }

    const Signup = async (data) =>{
        setLoading(true)
        await axios.post('http://localhost:8080/auth/signup',{...data})
      .then((response) => {
        console.log(response)
        setUser(response.data.token);
        setIsAuthen(true);
        setUserId(response.data._id);
        setUserName(response.data.name)
      })
      .catch((err) => {
        alert(err.response.data.error)
        console.log(err);
      })
      setLoading(false)
    }
    return (
        <authContext.Provider value={{ isAuthen, user, loading,Login,Signup,loading,userId,userName}}>
          {children}
        </authContext.Provider>
      );
}


function useUserAuth() {
    return useContext(authContext);
}
export { AuthProvider, authContext ,useUserAuth};
