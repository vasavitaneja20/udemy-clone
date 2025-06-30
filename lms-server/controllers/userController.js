import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js'
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import Stripe from 'stripe';

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.json({ success: false, message: 'User not authenticated' });
    }

    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//get user's enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
      const userId = req.auth?.userId;
  
      if (!userId) {
        return res.json({ success: false, message: 'User not authenticated' });
      }
  
      const userData = await User.findById(userId).populate('enrolledCourses');
  
      if (!userData) {
        return res.json({ success: false, message: 'User not found in database' });
      }
  
      res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

  //purchase course
  export const purchaseCourse = async(req,res) =>{
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData){
           return res.json({success:false, message: 'User Data not found'})
        }
        if(!courseData){
            return res.json({success:false, message: 'Course Data not found'})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - ((courseData.discount*courseData.coursePrice)/100)).toFixed(2)
        }

        const newPurchase = await Purchase.create(purchaseData)

        //stripe gateway initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        //creating line items for stripe
        const line_items = [{
            price_data: {
                currency, 
                product_data: {
                    name: courseData.courseTitle,
                },
                unit_amount: Math.floor(newPurchase.amount)*100,
            }, 
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })
        res.json({success:true, session_url: session.url})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
  }