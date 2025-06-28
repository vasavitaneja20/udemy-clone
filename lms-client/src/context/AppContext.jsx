import{ createContext, useEffect, useState } from 'react';
import { dummyCourses } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import humanizeDuration from 'humanize-duration'

export const AppContext = createContext()

export const AppContextProvider = (props) =>{

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])




    //fetch all courses
    const fetchAllCourses = async () =>{
        setAllCourses(dummyCourses)
    }

     //fetch user enrolled coures
  const fetchUserEnrolledCourses = async() =>{
    setEnrolledCourses(dummyCourses)
 }
  

    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])


    //function to calculate avg rating of each course
    const calculateRating = (course) =>{
      if(course.courseRatings.length===0){
        return 0;
      }
      
      let totalRating=0
      course.courseRatings.forEach(rating =>{
        totalRating+=rating.rating
      })

      return totalRating/course.courseRatings.length
    }


    //function to calculate course chapter time
    const calculateChapterTime = (chapter) =>{
         let time=0;
         chapter.chapterContent.map((lecture)=> time+=lecture.lectureDuration);
         return humanizeDuration(time*60*1000, {units: ['hours', 'minutes']});

    }

    //function to calculate course duration
    const calculateCourseDuration = (course) =>{
        let time=0;
        course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture)=> 
        time+= lecture.lectureDuration) )
        return humanizeDuration(time*60*1000, {units: ['hours', 'minutes']});

    }

 // In your AppContext.jsx file
const calculateNoOfLectures = (course) => {
    // Ensure course and courseContent exist
    if (!course || !course.courseContent || !Array.isArray(course.courseContent)) {
      console.warn("Invalid course data or courseContent for calculateNoOfLectures", course);
      return 0; // Return 0 lectures if data is missing or malformed
    }
  
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
      // Ensure chapter.chapterContent exists and is an array
      if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      } else {
        console.warn("Chapter content is missing or not an array for chapter:", chapter);
      }
    });
    return totalLectures;
  };

 
    const value = {
       currency, allCourses, navigate, calculateRating, isEducator, calculateChapterTime,
       calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses, 
       
    }

   return (
   
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>

   )
}