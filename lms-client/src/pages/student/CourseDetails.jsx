import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from "humanize-duration";
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
import './CourseDetails.css'; // Linked CSS file

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateNoOfLectures,
    calculateChapterTime,
    calculateCourseDuration,
    currency
  } = useContext(AppContext);

  useEffect(() => {
    console.log("useEffect triggered", allCourses, id);
    const findCourse = allCourses.find(course => course._id === id);
    setCourseData(findCourse);
  }, [allCourses, id]);

  // Removed redundant useEffect, the first one is sufficient

  const toggleSection = (index) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Move this check to the very top of the return statement
  if (!courseData) {
    return <Loading />;
  }

  return (
    <>
      <div className="course-details-container">
        <div className="course-info-section">
          <div className="course-header">
            {/* These will now only render if courseData is not null */}
            <h1 className="course-title">{courseData.courseTitle}</h1>
            <p className="course-subtitle" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }} />
          </div>

          <div className="course-rating">
            <p>{calculateRating(courseData)}</p>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt="star" />
              ))}
            </div>
            <p>{courseData.courseRatings.length} rating(s)</p>
            <p>{courseData.enrolledStudents.length} student(s)</p>
          </div>

          <p className="course-instructor">Course by <span>Edemy</span></p>

          <div className="course-structure">
            <h2>Course Structure</h2>
            {courseData.courseContent.map((chapter, index) => (
              <div key={index} className="chapter-card">
                <div className="chapter-header" onClick={() => toggleSection(index)}>
                  <div className="chapter-title">
                    <img className={openSections[index] ? 'rotated' : ''} src={assets.down_arrow_icon} alt="arrow" />
                    <p>{chapter.chapterTitle}</p>
                  </div>
                  <p>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                </div>

                <div className={`chapter-body ${openSections[index] ? 'open' : ''}`}>
                  <ul>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i}>
                        <img src={assets.play_icon} alt="play" />
                        <div className="lecture-details">
                          <p>{lecture.lectureTitle}</p>
                          <div className="lecture-actions">
                            {lecture.isPreviewFree && (
                              <p className="preview-link" onClick={() => setPlayerData({ videoID: lecture.lectureUrl.split('/').pop() })}>
                                Preview
                              </p>
                            )}
                            <p>{humanizeDuration(lecture.lectureDuration * 60000, { units: ['hours', 'minutes'] })}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="course-description">
            <h3>Course Description</h3>
            <p dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} />
          </div>
        </div>

        <div className="course-sidebar">
            
          {playerData ? (
            <YouTube
              videoId={playerData.videoID}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="youtube-player"
            />
          ) : (
            <img className='course-photo' src={courseData.courseThumbnail} alt="thumbnail" />
          )}

          <div className="course-meta">
            <p className="time-left"><img src={assets.time_left_clock_icon} alt="" /> 5 days left at this price!</p>

            <div className="course-price">
              <p className="discounted">{currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)}</p>
              <p className="original">{currency}{courseData.coursePrice}</p>
              <p className="discount">{courseData.discount}% off</p>
            </div>

            <div className="course-highlights">
              <div><img src={assets.star} alt="star" /> {calculateRating(courseData)}</div>
              <div><img src={assets.time_clock_icon} alt="time" /> {calculateCourseDuration(courseData)}</div>
              <div><img src={assets.lesson_icon} alt="lesson" /> {calculateNoOfLectures(courseData)} lessons</div>
            </div>

            <button className="enroll-button">{isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll now'}</button>

            <div className="course-features">
              <h4>What's in the course?</h4>
              <ul>
                <li>Lifetime access with free updates</li>
                <li>Step-by-step, hands-on project guidance</li>
                <li>Downloadable resources and source code</li>
                <li>Quizzes to test your knowledge</li>
                <li>Certificate of completion</li>
              </ul>
            </div>
          
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseDetails;