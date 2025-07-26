
import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AllRooms from './pages/AllRooms'
import RoomDetails from './components/RoomDetails'
import Footer from './components/Footer'
import MyBooking from './pages/MyBooking'
import HotelReg from './components/HotelReg'




const App = () => {
  const isOwnerPath  =  useLocation().pathname.includes("owner")
  
  return (
    <div>
      
      {!isOwnerPath &&  <Navbar/>}
      {false && <HotelReg/>}
     
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element = {<Home/>}/>
          <Route path='/rooms' element = {<AllRooms/>}/>
          <Route path='/rooms/:roomId' element = {<RoomDetails/>}/>
          <Route path='/my-booking' element = {<MyBooking/>}/>
        </Routes>
        <Footer/>
      </div>
      
    </div>
  )
}

export default App
