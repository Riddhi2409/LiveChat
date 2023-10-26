import React from 'react'

function SelfMessage({props,name}) {
  return (
    <div className=' dark:bg-[#222e35]  dark:text-slate-300 flex flex-col gap-0 items-start justify-start max-w-[60%] w-fit p-2 bg-slate-200 rounded-xl m-4'>
        <h1 className='font-semibold leading-5 text-slate-700 dark:text-white'>{name}</h1>
        <h1 className='text-sm break-all'>{props}</h1>
        <div className='flex flex-row-reverse w-full text-xs text-slate-600 dark:text-white' >
            {/* <h2>12:00am</h2> */}
        </div>
    </div>
  )
}

export default SelfMessage