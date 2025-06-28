import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CourseList from './pages/student/CourseList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import NavBar from './components/student/NavBar'
import './App.css' // Import the CSS
import "quill/dist/quill.snow.css";

const App = () =>{
  
  /* When using educator component, we are using a different NavBar, so we define a boolean value to check path */
  const isEducatorRoute = useMatch('/educator/*')

  return (
  <div className='container'>
    {!isEducatorRoute && <NavBar />} 
    
     <Routes>
      <Route path = '/' element={<Home />} />
     
      <Route path = '/course-list' element={<CourseList />} />
      <Route path = '/course-list/:input' element={<CourseList />} />
      <Route path = '/course/:id' element={<CourseDetails />} />
      <Route path = '/my-enrollments' element={<MyEnrollments />} />
      <Route path = '/player/:courseId' element={<Player />} />
      <Route path = '/loading/:path' element={<Loading />} />
      <Route path='/educator' element={<Educator />}>
  <Route index element={<Dashboard />} />
  <Route path='add-course' element={<AddCourse />} />
  <Route path='students-enrolled' element={<StudentsEnrolled />} />
  <Route path='my-courses' element={<MyCourses />} />
</Route>


      
      

     </Routes>
  </div>
  )
}

export default App