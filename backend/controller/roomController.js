//api to create a new room for a hotel//
import Hotel from "../models/Hotel.js";
import Room from "../models/room.js";
import { v2 as cloudinary } from "cloudinary";
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.user._id });
    if (!hotel) {
      return res.json({ success: false, msg: "Hotel not found" });
    }
    //upload images to cloudinary//
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });
    // wait for all uploads to complete//

    const images = await Promise.all(uploadImages);
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });
    res.json({ success: true, msg: "Room created successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};

// api to get all rooms

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
            model: "UserModel",
            select:"email name",
        },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};
// api to get all rooms for specific hotel
export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.user._id });
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate(
      "hotel"
    );
    res.json({ success: true, rooms });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};
// api to toggle availability ofa rooms//
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, msg: "Room availability updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, msg: error.message });
  }
};
