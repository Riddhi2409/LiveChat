import React from 'react'

function SelfMessage({name,props}) {
  return (
    <div className='flex justify-end w-full'>
    <div className='flex flex-col justify-start max-w-[60%] w-fit p-2 rounded-xl m-4 bg-green-200 dark:bg-[#00a884] dark:text-slate-100 gap-1'>
      <h1 className='text-slate-800 text-sm font-bold'>{name}</h1>
        <h1 className='text-sm break-all'>{props}</h1>
        <div className='flex flex-row-reverse w-full text-xs text-slate-600 dark:text-white'>
            {/* <h2>12:00am</h2> */}
        </div>
    </div>
    </div>
  )
}

export default SelfMessage