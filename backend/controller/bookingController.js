import Booking from "../models/booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/room.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


// function to check availability of room
const checkAvailability = async({checkInDate, checkOutDate, room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate:{$lte:checkOutDate},
            checkOutDate:{$gte:checkInDate},
        })
        const isAvailable = bookings.length === 0;
        return isAvailable;

    } catch (error) {
        console.log(error.message)
    }
}

// api to check availability of room//
export const checkAvailabilityApi = async(req,res)=>{
    try {
        const {checkInDate, checkOutDate, room} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room})
        res.json({success:true, isAvailable})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}


// api to create a new booking with Stripe payment
export const createBooking = async (req, res) => {
 const frontend_url = "http://localhost:5173";
  try {
    const { checkInDate, checkOutDate, room, guests } = req.body;
    const userId = req.user._id;

    // 1️⃣ Check room availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    if (!isAvailable) {
      return res.json({ success: false, msg: "Room is Not Available" });
    }

    // 2️⃣ Get room & hotel details
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // 3️⃣ Calculate total nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice *= nights;

    // 4️⃣ Create booking record in DB (pending payment)
    const booking = await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
      status: "pending", // add a status field in your Booking model
    });


    // 5️⃣ Stripe payment setup
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${roomData.hotel.name} - ${roomData.name} (${nights} nights)`,
          },
          unit_amount: roomData.pricePerNight * 100, // in cents
        },
        quantity: nights,
      },
    ];

    // Optional: Add taxes or service fees
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Service Fee",
        },
        unit_amount: 10 * 100, // $10
      },
      quantity: 1,
    });

    // 6️⃣ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/my-booking?success=true&bookingId=${booking._id}`,
  cancel_url: `${frontend_url}/my-booking?success=false&bookingId=${booking._id}`,
    });
    


    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};


export const verifyBooking = async(req,res)=>{
const{bookingId, success} = req.body;
try {
    if(success==="true"){
        await Booking.findByIdAndUpdate(bookingId, {isPaid:true});
        res.json({success:true, msg:"Paid"})
    }else{
        await Booking.findByIdAndDelete(bookingId)
        res.json({success:false,msg:"Not Paid"})
    }
} catch (error) {
     console.error( error);
        res.status(500).json({
            success: false,
            msg: error.message || "failed"
        });
}
}






// api to get all booking for a users//
export const getUserBooking = async(req,res)=>{
    try {
        const user = req.user._id
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
        res.json({success:true, bookings})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
    }
    
}


export const getHotelBookings = async(req,res)=>{
    try {
        const hotel = await Hotel.findOne({owner:req.user._id})
        if(!hotel){
            return res.json({success:false, msg:"Hotel Not Found !"})
        }
        const bookings = await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdAt: -1})
        // total booking//
        const totalBookings = bookings.length;
         // totalRevenue//
         const totalRevenue = bookings.reduce((acc,booking)=>acc + booking.totalPrice, 0)
        res.json({success:true, dashboardData:{
            totalBookings,
            totalRevenue,
            bookings
        }})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}

