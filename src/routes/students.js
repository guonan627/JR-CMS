const express = require('express');
const {
    getAllStudents,
    getStudentById, 
    updateStudentById, 
    deleteStudentById, 
    createStudent,
    addStudentToCourse,
    removeStudentFromCourse
} = require('../controllers/students')

const router = express.Router();

router.get('/',getAllStudents);
// router.get('/', tryCatch(getAllStudents));
router.get('/:id',getStudentById);
// router.get('/:id',tryCatch(getStudentById));
router.put('/:id',updateStudentById);
// router.put('/:id',tryCatch(updateStudentById));
router.delete('/:id',deleteStudentById);
// router.delete('/:id',tryCatch(deleteStudentById));
router.post('/',createStudent);
// router.post('/',tryCatch(createStudent));

router.post('/:id/courses/:code', addStudentToCourse);
router.delete('/:id/courses/:code', removeStudentFromCourse);

module.exports = router;