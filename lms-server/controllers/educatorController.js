// controllers/educatorController.js

import { clerkClient } from '@clerk/clerk-sdk-node'; // FIX: Correct import for clerkClient
import Course from '../models/Course.js'; // Ensure .js extension
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // For deleting temporary files
import Purchase from '../models/Purchase.js'
import User from '../models/User.js';


// Cloudinary Configuration (make sure these are in your .env and loaded in server.js)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// update role of user to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        });
        res.status(200).json({ success: true, message: 'You can publish a course now!' });
    } catch (error) {
        console.error('Error updating role to educator:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Add new course
// controllers/educatorController.js

// ... (your existing imports and updateRoleToEducator function)

//Add new course
export const addCourse = async (req, res) => {
    try {
      const courseData = req.body;
      const imageFile = req.file;
  
      // ✅ Use req.auth() instead of deprecated req.auth.userId
      const { userId: educatorId } = req.auth();
  
      if (!educatorId) {
        return res.status(401).json({
          success: false,
          message: 'Educator ID not found. User must be authenticated.'
        });
      }
  
      if (!imageFile) {
        return res.status(400).json({
          success: false,
          message: 'Course thumbnail is required. Please attach an image.'
        });
      }
  
      // ✅ Parse courseContent if it's a JSON string
      if (courseData.courseContent && typeof courseData.courseContent === 'string') {
        try {
          courseData.courseContent = JSON.parse(courseData.courseContent);
        } catch (jsonError) {
          return res.status(400).json({
            success: false,
            message: 'Invalid JSON format for courseContent. Please ensure it is a valid JSON array.',
            error: jsonError.message
          });
        }
      }
  
      // ✅ Convert string numbers to real numbers
      if (courseData.coursePrice) {
        courseData.coursePrice = parseFloat(courseData.coursePrice);
        if (isNaN(courseData.coursePrice)) {
          return res.status(400).json({
            success: false,
            message: 'coursePrice must be a valid number.'
          });
        }
      }
  
      if (courseData.discount) {
        courseData.discount = parseInt(courseData.discount);
        if (isNaN(courseData.discount)) {
          return res.status(400).json({
            success: false,
            message: 'discount must be a valid number.'
          });
        }
      }
  
      // ✅ Upload image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path);
      courseData.courseThumbnail = imageUpload.secure_url;
  
      // ✅ Assign educator ID BEFORE saving to DB
      courseData.educator = educatorId;
  
      // ✅ Create course
      const newCourse = await Course.create(courseData);
  
      // (Optional) delete temp file after upload
      // fs.unlinkSync(imageFile.path);
  
      res.status(201).json({
        success: true,
        message: 'Course Added Successfully!',
        course: newCourse
      });
  
    } catch (error) {
      console.error('Error adding course:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: `Course validation failed: ${error.message}`
        });
      }
      res.status(500).json({
        success: false,
        message: `Failed to add course: ${error.message}`
      });
    }
  };
  


  //get educator courses
  export const getEducatorCourses = async(req, res) =>{
     try {

        const educator = req.auth.userId
        const courses = await Course.find({educator})
        res.json({success: true, courses})

     } catch (error) {
        
        res.json({success: false, message: error.message})

     }
  };

  //get educator dashboard
export const educatorDashboardData = async(req, res)=>{
      try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const totalCourses = courses.length;
        const courseIds = courses.map((course)=>course._id);
         
        //calculate total earnings
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase)=>
            sum + purchase.amount, 0);

        //collect unique enrolled student IDs with course titles
        const enrolledStudentsData = [];
        for (const course of courses){
            const students = await User.find({
                _id: {$in : course.enrolledStudents}
            }, 'name imageUrl');
        
        students.forEach(student=>{
            enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
            });
        });
        }
        res.json({success:true, dashboardData: {
            totalEarnings, enrolledStudentsData, totalCourses
        }})

      } catch (error) {
        res.json({success:false, message: error.message
        });
      }
};

//get enrolled students data with purchase data
export const getEnrolledStudentsData = async(req, res) =>{
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({educator});
        const courseIds = courses.map(course=>course._id)
        
        const purchases = await Purchase.find({
             courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student : purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseData: purchase.createdAt

        }));
        res.json({success:true, enrolledStudents})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}