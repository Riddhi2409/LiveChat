import React from 'react';
import { useUserAuth } from '../store/userAuth';

function Welcome() {
  const {userName} = useUserAuth();

  return (
    <div className=' basis-3/4 flex flex-col h-full justify-center items-center gap-2'>
        <img src="https://cdn-icons-png.flaticon.com/512/2936/2936956.png" alt="logo" className='w-[30%] p-2'/>
        <h1 className='dark:text-slate-200 text-lg font-mono text-slate-600 '>hii {userName}</h1>
        <p className='dark:text-slate-500 text-lg font-mono text-slate-400 '>View and text directly to people in chat room</p>
    </div>
  )
}

export default Welcome