import UserModel from "../models/User.js";
import { Webhook } from "svix";


const clerkWebhooks = async(req,res)=>{
    try {
        // create svix instance with clerk webhook secret//
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
            // getting headers//
            const headers = {
                'svix-id':req.headers['svix-id'],
                'svix-timestamp':req.headers['vix-timestamp'],
                'svix-signature':req.headers['svix-signature'],
            }
            // verifying headers //
            await wh.verify(JSON.stringify((req.body),headers))

            // getting data from request body//
            const{data, type} = req.body;
            const userData = {
                _id:data.id,
                email:data.email_addresses[0].email_address,
                username:data.first_name + " " + data.last_name,
                image :data.image_url
            }

            // switch cases for different events//
             switch (type) {
                 case 'user.created':{
                    await UserModel.create(userData)
                    break;
                }

                case 'user.updated':{
                    await UserModel.findByIdAndUpdate(data.id, userData)
                    break;
                }
                    
                case 'user.deleted':{
                    await UserModel.findByIdAndDelete(data.id)
                    break;
                }
            default:
                    break;
            }

            res.json({success:true, msg:"Webhook Received"})

    } catch (error) {
        console.log(error.message)
        res.json({success:false, msg:error.message})
    }
}

export default clerkWebhooks;
