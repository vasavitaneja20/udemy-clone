console.log("--- DEBUG: userController.js (v7.1) is LOADING ---");
import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js'
import Course from '../models/Course.js';
import stripe from 'stripe';
import { CourseProgress } from '../models/CourseProgress.js';
// In your userController.js file:
import  { Purchase } from '../models/Purchase.js'; // <-- Change this line

console.log("DEBUG: Purchase module loaded successfully with named import syntax.");

// Now it correctly imports the named export 'Purchase'
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ proper way

    console.log('userId from req.auth():', req.auth());


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
        const { userId } = req.auth(); // ✅ proper way
  
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
    console.log("🟢 Hit /purchase route");
    try {
        const {courseId} = req.body;
        const {origin} = req.headers;
        const { userId } = req.auth(); // ✅ proper way

        if (!userId) { // Added check for authenticated user
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if(!userData){
            return res.status(404).json({success:false, message: 'User Data not found'});
        }
        if(!courseData){
            return res.status(404).json({success:false, message: 'Course Data not found'});
        }


        // Calculate amount, ensuring it's a number (toFixed returns string)
        const amount = parseFloat((courseData.coursePrice - ((courseData.discount * courseData.coursePrice) / 100)).toFixed(2));

        const purchaseData = {
            courseId: courseData._id,
            userId: userId, // Use the Clerk userId directly
            amount: amount,
            status: 'pending' // Initialize status as pending
        };

        const newPurchase = await Purchase.create(purchaseData);

        //stripe gateway initialize (ensure this is scoped correctly or imported)
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY); // Re-initialize or use a globally defined instance
        const currency = process.env.CURRENCY.toLowerCase();

        //creating line items for stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle,
                },
                unit_amount: Math.round(newPurchase.amount * 100), // Amount in cents/lowest currency unit
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            // --- THIS IS CORRECT FOR PASSING METADATA ---
            metadata: {
                purchaseId: newPurchase._id.toString(),
               
            }
        });

        res.json({success:true, session_url: session.url});

    } catch (error) {
        console.error("Error in purchaseCourse:", error); // Log the full error
        res.status(500).json({success:false, message: error.message});
    }
};


  //update user course progress
 export const updateUserCourseProgress = async(req, res) =>{
    try {
        
        const { userId } = req.auth(); // ✅ proper way

        const { courseId, lectureId }  = req.body

        const progressData = await CourseProgress.findOne({userId, courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                  res.json({success:true, message: "Lecture already completed"})
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }
        else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({success:true, message: "Progress updated"})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
  }


  //get user course progress
 export const getUserCourseProgress = async (req,res) =>{
    try {

        const { userId } = req.auth(); // ✅ proper way

        const { courseId }  = req.body

        const progressData = await CourseProgress.findOne({userId, courseId})
        
        res.json({success:true, progressData})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
 } 


 //add user rating to course
 export const addUserRating = async(req, res) =>{
    const { userId } = req.auth(); // ✅ proper way

    const {courseId, rating} = req.body

    if(!courseId || !userId || !rating || rating<1 || rating >5 ){
        return res.json({success:false, message: "Invalid details"})
    }


    try {
        const course = await Course.findById(courseId)

        if(!course){
            return res.json({success:false, message: "Course not found"})
        }

        const user = await User.findById(userId)

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success:false, message: "User has not purchased this course"})
        }


        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)
        //returns positive value if rating found for given user, else negative

        if(existingRatingIndex > -1 ){
            course.courseRatings[existingRatingIndex].rating = rating;
        }
        else{
            course.courseRatings.push({
                userId,
                rating
            })
        }

        await course.save();
        return res.json({success:true, message: "Rating added"})
       
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
 }

