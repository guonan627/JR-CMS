const Student = require('../models/student');
const Course = require('../models/course');

// 抓取错误方法5 express-async-errors package 直接改了express router里面的逻辑
// 升级到express5里就直接包含这个package 不用手动安装了
// 这个项目就用的 express-async-errors package 

// 抓取错误方式4 只写一次try catch 但要在routes里 在router.后面都加tryCatch
// function tryCatch (routeHandler) {
//     return (req, res, next) => {
//         try {
//             routeHandler(req, res, next);
//         } catch(e){
//             next(e);
//         }
//     }
// }

async function getAllStudents(req, res){
   const students = await Student.find().exec();
   return res.json(students);
}

async function getStudentById(req, res){
    const {id} = req.params;
    const student = await Student.findById(id).populate('courses','name').exec(); // 还想取到关联ref的collection数据用populate(),还可以具体到某一个字段，如果想取到2个以上的字段呢？
    if(!student) {
        return res.sendStatus(404);
    }
    return res.json(student);
}
async function updateStudentById(req, res){
    const {id} = req.params;
    const {firstName, lastName, email} = req.body;
    const student = await Student.findByIdAndUpdate(
        id, 
        {firstName, lastName, email},
        {new: true}
    ).exec();
    if (!student){
        return res.sendStatus(404);
    }
    return res.json(student);
}

async function deleteStudentById(req, res){
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id).exec();
    if (!student){
        return res.sendStatus(404);
    }

    // 确保删除了该student后， 在对应的ref course collection里的该student也删掉
    await Course.updateMany(
        // {
        // students: student._id  //第一个大括号是搜索条件
        // }, 
        // 也可以写成
        {
            _id: {$in: student.courses }  // 找寻course的id, 看course_id是否在student的courses filed里
        },
        {
            $pull: {
                students: student._id  //从course collection里的students field里面把student._id给pull出来删掉
            }
        }
    );   

    return res.sendStatus(204);
}

async function createStudent(req, res, next){
    // validate data
    const {firstName, lastName, email} = req.body; //变量的大小写一定要和mongoose的一一匹配， 也要和client发过来的名字一一匹配
    const student = new Student({firstName, lastName, email}); 
    await student.save();
    // 抓取错误的方式1 try catch
    // try {
    //   await student.save();
    // } catch(e){
    //     next(e);
    // }

    // 抓取错误方式2 旧的写法 callback function
    // student.save((error, result) => {
    //     if (error) {
    //         next(e);
    //     }
    //     res.status(201).json(student);
    // })

    // 抓取错误方式3 promise
    // student.save().then((result) => {       此处.save() 可替换成。findIdAndDelete(), .findIdAndUpdate(), .findById()
    //     return res.status(201).json(student); 
    // }).catch(error => {
    //     next(error);
    // })

     // 抓取错误方式4 只写一次try catch 见上面

    return res.status(201).json(student); 
}

async function addStudentToCourse(req, res) {
    // get student id, get course code
    const { id, code} = req.params;

    // find student
    const student = await Student.findById(id).exec();
    // find course
    const course = await Course.findById(code).exec();

    // check student or course exists
    if (!student || !course) {
        return res.sendStatus(404);
        // return res.sendStatus(404).json('student or course not found'); 这么写对吗？
    }

    // check student is already enrolled 其实在调用mongoose api时候可以避过这个逻辑
    // student.courses.addToSet(course._id); 
    // ES6里的set和array很类似 不会有重复的值 值仅代表permitted type 无法检测object是否重复 存时仅能保证数字没有重复，字符串没有重复
    // addToSet() 代表把array变成set 保证object里的每一项都是独一无二的 不会出现重复enroll的情况 
    // 这里的business logic 是如果重复了course已经被该学生enrolled了 不会重复添加 不会做任何改动
    // 如果实际需求是 检测是否已经enroll了 这种写法就不合适 下面写法可以
    // 1. 
    // if (student.course.includes(course._id)){
    //     return res.sendStatus(409).json('the student has already enrolled this course');
    // }
    // 2.
    // const oldLength = student.course.length;
    // enroll完再取一次length 存个newLength 对比看看两次length有没有变化 有变化添加成功 如果没变化 就是该学生已经enroll了课程 

    // add student to course, add course to student
    student.courses.addToSet(course._id); 
    course.students.addToSet(student._id); 
    await student.save();
    await course.save();

    // return updated student or return 200/201
    return res.json(student);
    // return res.sendStatus(201).json(student); 这样写会报错 为什么？
}
async function removeStudentFromCourse(req, res) {
    const { id, code } = req.params;
    const student = await Student.findById(id).exec();
    const course = await Course.findById(code).exec();
    if (!student || !course) {
        return res.sendStatus(404);
    }
    student.courses.pull(course._id); // 从array里把某一项给取出来， pull会先看array里有没有这一项，如果有就删除， 如果没有不会做任何改动
    course.students.pull(student._id);
    await student.save();
    await course.save();
    return res.json(student);
    // or return res.sendStatus(204);
}

module.exports = {
    getAllStudents,
    getStudentById, 
    updateStudentById, 
    deleteStudentById, 
    createStudent,
    addStudentToCourse,
    removeStudentFromCourse
};