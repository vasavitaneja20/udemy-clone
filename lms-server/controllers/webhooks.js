import { Webhook } from "svix";
import User from "../models/User.js";
import { request } from "express";

/*What Are Webhooks?. What is a Webhook? 
A webhook is a way for one application to automatically send real-time data to another 
application when a specific event occurs. It's essentially an automated message sent over 
HTTP, triggered by an event, and delivered to a pre-defined URL. 

This code sets up a webhook handler using Svix, which is a service for securely 
verifying webhooks (in this case, from Clerk, an authentication provider).*/


//API controller function to manage clerk user with database
export const clerkWebhooks = async(req, res) =>{
   try{
       const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

       await whook.verify(JSON.stringify(req.body), {
           "svix-id" : req.headers["svix-id"],
           "svix-timestamp":  req.headers["svix-timestamp"],
           "svix-signature" : req.header["svix-signature"]
       })

       const {data, type} = req.body 
       switch (type) {
        case 'user.created':{
            const userData = {
                _id: data.id,
                email: data.email_address[0],
                name: data.first_name + " " + data.last_name,
                imageUrl : data.image_url,
            }

            //save data in database
            await User.create(userData)
            res.JSON({})
            break;
        }
         
        case 'user.updated': {
            const userData = {
                //id cannot be updated
                email: data.email_address[0],
                name: data.first_name + " " + data.last_name,
                imageUrl : data.image_url,
            }
            await User.findByIdAndUpdate(data.id, userData)
            res.JSON({})
            break;
        }

        case 'user.deleted' : {
            await User.findByIdAndDelete(data.id)
            res.JSON({})
            break;
        }
        
       
        default:
            break;
       }
   }
   catch(error){
        res.JSON({success: 'false', message: error.message})
   }
}