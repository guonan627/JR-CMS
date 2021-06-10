const express = require('express');
const {
    getAllStudents,
    getStudentById, 
    updateStudentById, 
    deleteStudentById, 
    createStudent
} = require('../controllers/students')

const router = express.Router();

router.get('/',getAllStudents);
router.get('/:id',getStudentById);
router.put('/:id',updateStudentById);
router.delete('/:id',deleteStudentById);
router.post('/',createStudent);

module.exports = router;