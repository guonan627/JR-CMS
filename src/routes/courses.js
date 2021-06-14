const express = require('express');
const {
    getAllCourses,
    getCourseById, 
    updateCourseById, 
    deleteCourseById, 
    createCourse
} = require('../controllers/Courses')

const router = express.Router();

router.get('/',getAllCourses);
// router.get('/',tryCatch(getAllCourses));
router.get('/:id',getCourseById);
// router.get('/:id',tryCatch(getCourseById));
router.put('/:id',updateCourseById);
// router.put('/:id',tryCatch(updateCourseById));
router.delete('/:id',deleteCourseById);
// router.post('/',tryCatch(createCourse));
router.post('/',createCourse);

module.exports = router;