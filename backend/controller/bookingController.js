import transporter from "../config/nodeMailer.js";
import Booking from "../models/booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/room.js";


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

// api to create a new booking//
export const createBooking = async(req,res)=>{
    try {
         const {checkInDate, checkOutDate, room, guests} = req.body;
         const user = req.user._id;
         // checking availability before booking//
         const isAvailable = await checkAvailability({checkInDate, checkOutDate, room})
         if(!isAvailable){
            return res.json({success:false, msg:"Room is Not Available"})
         }
         const roomData = await Room.findById(room).populate('hotel');
         let totalPrice = roomData.pricePerNight;
         // calculate total price based on the night//
         const checkIn = new Date(checkInDate)
         const checkOut = new Date(checkOutDate)
         const timeDiff = checkOut.getTime() - checkIn.getTime();
         const nights = Math.ceil(timeDiff / (1000*3600*24));
         totalPrice *= nights;

         const booking =  await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guests:+guests,
            checkInDate, 
            checkOutDate,
            totalPrice

         })

      const mailOptions = {
  from: 'Sudais Hotel Bookings <sudaisaliyi@gmail.com>', 
  to: req.user.email,
  subject: "Hotel Booking Details",
  html: `<h2>Your Booking Details</h2>
  <p>Dear ${req.user.name},</p>
  <p>Thank you for your booking! Here are your booking details:</p>
  <ul>
    <li><strong>Booking ID:</strong> ${booking._id}</li>
    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
    <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
    <li><strong>Booking Amount:</strong> $${booking.totalPrice}/night</li>
  </ul>
  <p>We look forward to welcoming you!</p>
  <p>If you need to make any changes, feel free to contact us.</p>`
};
 await transporter.sendMail(mailOptions)


         res.json({success:true, msg:"Booking Created successfully"})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
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


