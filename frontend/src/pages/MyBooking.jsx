import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBooking = () => {
  const{axios, token, user} = useAppContext()
  const [booking, setBooking] = useState([]);

  const fetchUserBookings = async()=>{
    try {
      const{data} = await axios.get('/api/booking/user', {headers:{Authorization:`Bearer ${token}`}})
      if(data.success){
        setBooking(data.bookings)
      }
      else{
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error(error.msg)
    }
  }


  useEffect(()=>{
    if(user){
      fetchUserBookings()
    }
  },[user])

  return user &&(
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 x:px-32">
      <Title
        title="My Booking"
        subTitle="Welcome to Luxury Haven Hotel, an , sophistication,our hotel blends modern 

                    Unrivaled Accommodations
                    Indulge in."
        align="left"
      />
      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/2">Hotels</div>
          <div className="w-1/2">Date & Timings</div>
          <div className="w-1/2">Payment</div>
        </div>
        {booking.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full 
            border-b border-gray-300 font-medium text-base py-6 first:border-t"
          >
            {/* hotel details */}
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <img
                src={booking.room.images[0]}
                alt="hotel img"
                className="min-md:w-44 rounded shadow object-cover"
              />
              <div className=" flex flex-col gap-2">
                <p>
                  {booking.hotel.name}
                  <span>({booking.room.roomType})</span>
                </p>

                <div className="flex gap-2">
                  <img src={assets.locationIcon} alt="" />
                  <span>{booking.hotel.address}</span>
                </div>
                <div className="flex gap-2">
                  <img src={assets.guestsIcon} alt="" />
                  <span> Guests:{booking.guests}</span>
                </div>
                <p>Totals: ${booking.totalPrice}</p>
              </div>
            </div>

            {/* date and timings */}
            <div className="flex flex-row items-center md:gap-10 mt-3 gap-6">
              <div>
                <p>Check_In</p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p>Check_Out</p>
                <p className="text-gray-500 text-sm">
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* payment status */}
            <div className="flex flex-col items-start justify-center pt=3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${
                    booking.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <p
                  className={`text-sm rounded-full ${
                    booking.isPaid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {booking.isPaid ? "Paid" : "UnPaid"}
                </p>
              </div>
              {!booking.isPaid && (
                <button className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:gr-gray-50 transition-all cursor-pointer">
                  {" "}
                  Pay Now{" "}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
   
    
 
};

export default MyBooking;
