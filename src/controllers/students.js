const Student = require('../models/student');
// 抓取错误方法5 express-async-errors package 直接改了express router里面的逻辑
// 升级到express5里就直接包含这个package 不用手动安装了

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
    const student = await Student.findById(id).exec();
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

module.exports = {
    getAllStudents,
    getStudentById, 
    updateStudentById, 
    deleteStudentById, 
    createStudent
};