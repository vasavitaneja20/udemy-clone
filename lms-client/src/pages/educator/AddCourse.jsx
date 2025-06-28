import React, { useRef, useState, useEffect } from 'react';
import uniqid from 'uniqid';
import Quill from 'quill';
import { assets } from '../../assets/assets';
import './AddCourse.css';

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [courseDiscount, setCourseDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
    }
  }, []);

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter chapter name');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter(ch => ch.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(chapters.map(ch =>
        ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
      ));
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(chapters.map(ch => {
        if (ch.chapterId === chapterId) {
          ch.chapterContent.splice(lectureIndex, 1);
        }
        return ch;
      }));
    }
  };

  const addLecture = () => {
    setChapters(chapters.map(ch => {
      if (ch.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder: ch.chapterContent.length > 0
            ? ch.chapterContent.slice(-1)[0].lectureOrder + 1
            : 1,
          lectureId: uniqid()
        };
        ch.chapterContent.push(newLecture);
      }
      return ch;
    }));
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit logic to backend
    console.log("Course submitted", { courseTitle, coursePrice, courseDiscount, image, chapters });
  };

  return (
    <div className="add-course-container">
      <form onSubmit={handleSubmit} className="course-form">
        {/* Course Title */}
        <label>
          Course Title
          <input type="text" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required />
        </label>

        {/* Course Description */}
        <label>
          Course Description
          <div ref={editorRef} className="quill-editor" />
        </label>

        {/* Price & Discount */}
        <div className="row">
          <label>
            Price
            <input type="number" value={coursePrice} onChange={e => setCoursePrice(e.target.value)} required />
          </label>
          <label>
            Discount %
            <input type="number" value={courseDiscount} onChange={e => setCourseDiscount(e.target.value)} min={0} max={100} />
          </label>
        </div>

        {/* Thumbnail Upload */}
        <label className="thumbnail-upload">
          Upload Thumbnail
          <input type="file" onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
          {image && <img src={URL.createObjectURL(image)} alt="preview" />}
        </label>

        {/* Chapters & Lectures */}
        <div className="chapters">
          {chapters.map((ch, ci) => (
            <div key={ci} className="chapter">
              <div className="chapter-header">
                <span onClick={() => handleChapter('toggle', ch.chapterId)}>▼</span>
                <h4>{ci + 1}. {ch.chapterTitle}</h4>
                <button type="button" onClick={() => handleChapter('remove', ch.chapterId)}>X</button>
              </div>
              {!ch.collapsed && (
                <div className="lectures">
                  {ch.chapterContent.map((lec, li) => (
                    <div key={li} className="lecture">
                      <span>{li + 1}. {lec.lectureTitle} - {lec.lectureDuration}min</span>
                      <button type="button" onClick={() => handleLecture('remove', ch.chapterId, li)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleLecture('add', ch.chapterId)}>+ Add Lecture</button>
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={() => handleChapter('add')}>+ Add Chapter</button>
        </div>

        <button type="submit" className="submit-button">Submit Course</button>
      </form>

      {/* Lecture Modal */}
      {showPopup && (
        <div className="lecture-popup">
          <div className="lecture-form">
            <h3>Add Lecture</h3>
            <input placeholder="Lecture Title" value={lectureDetails.lectureTitle} onChange={e => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })} />
            <input placeholder="Duration (minutes)" value={lectureDetails.lectureDuration} onChange={e => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })} />
            <input placeholder="Video URL" value={lectureDetails.lectureUrl} onChange={e => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })} />
            <button type="button" onClick={addLecture}>Add Lecture</button>
            <button type="button" onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
