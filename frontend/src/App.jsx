import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./components/RoomDetails";
import Footer from "./components/Footer";
import MyBooking from "./pages/MyBooking";
import HotelReg from "./components/HotelReg";
import LoginSignup from "./pages/LoginSignup";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import LayOut from "./pages/hotelOwner/LayOut";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";

const App = () => {
  const { showHotelReg } = useAppContext();
  return (
    <div>
      {showHotelReg && <HotelReg />}

      <Toaster />
      <Navbar />

      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:roomId" element={<RoomDetails />} />
          <Route path="/my-booking" element={<MyBooking />} />
          <Route path="/owner" element={<LayOut />}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="room-list" element={<ListRoom />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

export default App;
