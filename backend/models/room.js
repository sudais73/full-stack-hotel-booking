import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId, // Must be ObjectId for population
    required: true,
    ref: 'Hotel' // Must match exactly how Hotel model is registered
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'] // Recommended
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 1 // Ensure positive number
  },
  amenities: [{
    type: String,
    required: true
  }],
  images: [{
    type: String,
    required: true
  }],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);
export default Room;