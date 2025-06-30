import express from 'express';
import { getCourseId, getAllCourse } from '../controllers/courseController.js';

const courseRouter = express.Router()
courseRouter.get('/all', getAllCourse)
courseRouter.get('/:id', getCourseId)

export default courseRouter