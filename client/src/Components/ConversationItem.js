import React from 'react'

function ConversationItem({name,firstLetter, lastmessage}) {
  return (
    <div className=' flex w-full  p-1 items-center gap-3 border-b-2 dark:border-slate-500'>
        <h1 className='w-[2rem] h-[2rem] rounded-full text-white bg-gray-300 flex items-center justify-center text-lg font-bold dark:bg-slate-700'>{firstLetter}</h1>
        <div className='flex flex-col w-full text-slate-500'>
        <p className='font-bold text-lg'>{name}</p>
        <div className='flex justify-between w-full gap-4 text-sm'>
        <p>{lastmessage}</p>
        {/* <p>today</p> */}
        
        </div>
        </div>
    </div>
  )
}

export default ConversationItem