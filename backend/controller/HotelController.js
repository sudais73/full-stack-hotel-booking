import Hotel from "../models/Hotel.js";
import UserModel from "../models/User.js";

export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;

        // Basic validation
        if (!name || !address || !contact || !city) {
            return res.json({ 
                success: false, 
                msg: "All fields are required!" 
            });
        }

        // Check if user already owns a hotel
        const existingHotel = await Hotel.findOne({ owner });
        if (existingHotel) {
            return res.json({ 
                success: false, 
                msg: "You already own a hotel!" 
            });
        }

        // Create hotel
        await Hotel.create({ name, address, contact, city, owner });

        // Update user role
        await UserModel.findByIdAndUpdate(owner, { role: "hotelOwner" });

        res.json({ 
            success: true, 
            msg: "Hotel Registered Successfully" 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ 
            success: false, 
            msg: "Server Error. Please try again." 
        });
    }
};