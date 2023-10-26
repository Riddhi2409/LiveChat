import React, { useState } from "react";
import { Backdrop, Button } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useUserAuth } from "../store/userAuth";

function Login() {
  const [login, setLogin] = useState(false);
  const [inputs, setInputs] = useState({});
  const {Login , Signup , loading} = useUserAuth();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async(event) => {
    event.preventDefault();
    
    // console.log(inputs);
    if (login){
      Login(inputs)
    }
    else {
      Signup(inputs)
    }

    setInputs({})
  };
  return (
    <div className="bg-gray-200 flex w-screen h-screen justify-center items-center ">
      <Backdrop
         sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
         open={loading}>
          <CircularProgress color="secondary" />
         </Backdrop>
      <div className="bg-white h-[90%] w-[95%] flex rounded-xl gap-2 overflow-hidden max-md:justify-center max-md:items-center ">
        <div className="flex flex-row h-full w-full">
          <div className="md:basis-1/4 bg-blue-50 flex items-center max-md:hidden">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2936/2936956.png"
              alt="logo"
              className="w-full p-2"
            />
          </div>
          <div className="flex flex-col gap-8 md:w-fit items-center md:basis-3/4 w-full justify-center">
            {login ? (
              <h1 className="text-green-400 text-3xl font-bold  max-md:text-base">
                Log in to your Account
              </h1>
            ) : (
              <h1 className="text-green-400 text-3xl font-bold max-md:text-base">
                Create Your Account
              </h1>
            )}

            <form className="flex flex-col gap-4 w-fit items-center justify-center font-mono" onSubmit={handleSubmit}>
              {!login && (
                <input
                  id="name"
                  placeholder="Enter Name"
                  name="name"
                  className="md:w-[15rem] p-2 border-2 max-md:text-xs max-h-8"
                  required={true}
                  onChange={handleChange}
                  value={inputs.name || ""}
    
                />
              )}
              <input
                placeholder="Enter Email Id"
                name="email"
                className="md:w-[15rem] p-2 border-2 max-md:text-xs max-h-8"
                onChange={handleChange}
                value={inputs.email || ""}
                required
              />
              <input
                placeholder="Password"
                type="password"
                name="password"
                className="md:w-[15rem] p-2 border-2 max-md:text-xs max-h-8"
                onChange={handleChange}
                value={inputs.password || ""}
                required
              />
              {!login && (
                <input
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  className="md:w-[15rem] p-2 border-2 max-md:text-xs max-h-8"
                  onChange={handleChange}
                  value={inputs.confirmPassword || ""}
                  required
                />
              )}
              <Button
                variant="outlined"
                className="w-fit"
                // onClick={handleSubmit}
                type="submit"
              >
               { login ? `Login` :`signup` } 
              </Button>
            </form>
            <h1 className="text-green-400 text-xl font-bold max-md:text-base">
              {!login ? `already have an account ? ` : `don't have an account`}
              {!login && (
                <span
                  className=" text-violet-500 underline hover:text-violet-700 cursor-pointer"
                  onClick={() => setLogin(true)}
                >
                  Login
                </span>
              )}{" "}
              {login && (
                <span
                  className=" text-violet-500 underline hover:text-violet-700 cursor-pointer"
                  onClick={() => {
                    setLogin(false);
                  }}
                >
                  SignUp
                </span>
              )}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
