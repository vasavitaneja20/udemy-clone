import React, { useContext, useEffect, useState } from 'react';
import './Player.css';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getCourseData = () => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    if (course) setCourseData(course);
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);

  return (
    <>
      <div className="player-container">
        <div className="player-left">
          <h2 className="section-heading">Course Structure</h2>
          {courseData &&
            courseData.courseContent.map((chapter, index) => (
              <div key={index} className="chapter-card">
                <div className="chapter-header" onClick={() => toggleSection(index)}>
                  <div className="chapter-title">
                    <img
                      className={`arrow-icon ${openSections[index] ? 'rotated' : ''}`}
                      src={assets.down_arrow_icon}
                      alt="arrow"
                    />
                    <p>{chapter.chapterTitle}</p>
                  </div>
                  <p>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                </div>
                <div className={`chapter-body ${openSections[index] ? 'open' : ''}`}>
                  <ul>
                    {chapter.chapterContent.map((lecture, i) => (
                      <li key={i} className="lecture-item">
                        <img src={assets.play_icon} alt="play" className="lecture-icon" />
                        <div className="lecture-details">
                          <p>{lecture.lectureTitle}</p>
                          <div className="lecture-actions">
                            {lecture.lectureUrl && (
                              <p className="preview-link" onClick={() =>
                                setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })
                              }>Watch</p>
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

          <div className="rating-section">
            <h1>Rate this course:</h1>
            <Rating initialRating={0} />
          </div>
        </div>

        <div className="player-right">
          {playerData ? (
            <>
              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                iframeClassName="video-frame"
              />
              <div className="video-footer">
                <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                <button className="complete-btn">Mark as complete</button>
              </div>
            </>
          ) : (
            <img src={courseData?.courseThumbnail || ''} alt="" className="thumbnail-image" />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
