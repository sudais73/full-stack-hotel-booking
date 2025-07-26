
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import UserModel from '../models/User.js';

// login//

const login = async(req, res)=>{
const {email,password} = req.body;
try {
    const user = await UserModel.findOne({email})
    if(!user){
        return res.json({success:false, msg:"User Doesn't exist"})
    }

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
    return res.json({success:false, msg:"Invalid Password"})
}

const token = createToken(user._id);

res.json({success:true, token})
} catch (error) {
      console.log(error)
     res.json({success:false, msg:"Error"})
}
}


const createToken = (id)=>{
return jwt.sign({id},process.env.JWT_SECRET)
}
// signup//

const signup = async (req,res)=>{
const{name,email,password} = req.body;

try {

    // checking for user exists or not//
    const existsUser = await UserModel.findOne({email})
    if(existsUser){
        return res.json({success:false, msg:"User Exists with this email id"})
    }
// validating email and password//
if(!validator.isEmail(email)){
    return  res.json({success:false, msg:"Please enter a valid email"})
}

if(password.length<8){
    return  res.json({success:false, msg:"Password must be at least 8 character"})
}

// hashing user password//
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

const newUser = new UserModel({
    name,
    email,
    password:hashedPassword
})
 const user = await newUser.save();

const token = createToken(user._id)
res.json({success:true, token})





} catch (error) {
    console.log(error)
     res.json({success:false, msg:"Error"})
}
}

const getUserData = async(req,res)=>{
    try {
        const role = req.user.role;
        const  recentSearchedCities = req.user.recentSearchedCities;
        res.json({success:true, role, recentSearchedCities})
    } catch (error) {
        console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}

// store user searched cities//
const storeRecentSearchedCities = async(req,res)=>{
    try {
        const {recentSearchedCity} = req.body;
        
        const user = await req.user
        if(user.recentSearchedCities.length <3){
            user.recentSearchedCities.push(recentSearchedCity)
        }else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity)
        }
        await user.save();
        res.json({success:true, msg:"City Added"})
    } catch (error) {
         console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}
export {login,signup, getUserData,storeRecentSearchedCities}