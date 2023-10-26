import React from 'react'
import Sidebar from './Sidebar'
import WorkArea from './WorkArea'
import CreateGroups from './CreateGroups'
import { Routes,Route } from 'react-router-dom'
import Welcome from './Welcome'
import Users from './Users'
import Groups from './Groups'
import Message from './Message'

function MainContainer({darkMode,setDarkMode}) {
  return (
    <div className='bg-[#f4f5f8] h-[90%] w-[95%] flex rounded-xl  overflow-hidden max-md:overflow-x-auto dark:bg-[#222e35] '>
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode}/>
        <Routes>
          <Route path='/*' element={<Welcome />} />
          <Route path='/creategroup' element={<CreateGroups darkMode={darkMode} />} />
          <Route path='availableUsers' element={<Users darkMode={darkMode}/>} />
          <Route path='/chat/:chatId' element={<WorkArea darkMode={darkMode}/>} />
          <Route path='/availableGroups' element={<Groups darkMode={darkMode} /> } />
          <Route path='/message' element={<Message darkMode={darkMode}/>} />
        </Routes>
        {/* <WorkArea darkMode={darkMode}/> */}
        {/* <CreateGroups /> */}
    </div>
  )
}

export default MainContainer