const Course = require('../models/course');
const Student = require('../models/student');
const joi = require('joi');
const Joi = require('joi');


async function getAllCourses(req, res){
    // db.collection.find() mongodb里这样写
   const courses = await Course.find().exec();
   return res.json(courses);
   // 这里数据返回的量太大 要考虑做分页
}

async function getCourseById(req, res){
    const {id} = req.params;
    const course = await Course.findById(id).populate('students').exec(); // polulate会在他相关联的collection里找到相应的字段挑出来显示
    if(!course) {
        return res.sendStatus(404);
    }
    return res.json(course);
}
async function updateCourseById(req, res){
    const {id} = req.params;
    //方法1. 此处应该对name， description数据做一个validate， 看到底有没有值， 有值再更新， 没有值不要传过来
   
    const {name, description} = req.body;
     //方法2. 先validate 看有没有值 分步骤赋值
     const course = await Course.findByIdAndUpdate(
        id, 
        {name, description},
        {new: true}
    ).exec();
    if (!course){
        return res.sendStatus(404);
    }
    return res.json(course);
}

async function deleteCourseById(req, res){
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id).exec();
    if (!course){
        return res.sendStatus(404);
    }

    // 确保删除了该course后， 在对应的ref student collection里的该course也删掉
    await Student.updateMany(
        // {
        //     courses: course._id    // 第一个大括号是搜索条件
        // }, 
        // 也可以写成
        {
            _id: {$in: course.students }  // 找寻student的id, 看student_id是否在course的students filed里
        },
        {
            $pull :{
                courses: course._id  //从该student collection里的courses field里面把course._id给pull出来删掉
             }
        }
    );

    return res.sendStatus(204);
    // return res.json(course);
}

async function createCourse(req, res){
    // const{code, name, description} = req. body; 
    // validate data by joi
    const schema = Joi.object ({
        name: Joi.string().min(2).max(10).required(),
        code: Joi.string().regex(/^[a-zA-Z0-9]+$/).required(),
        description: joi.string()
    });
     // 可以把一些通用的validation规则封装function复用, 或者导出,在其他地方导入复用 比如
    // const stringValidator = Joi.string().min(2).max(10).required();
    // const schema = Joi.object ({
    //     name: stringValidator,
    //     code: Joi.string().regex(/^[a-zA-Z0-9]+$/).required(),
    //     description: joi.string()
    // })
    const { code, name, description } = await schema.validateAsync (req.body, {
        allowUnknown: true, //可以接受schema定义以外的值 如果不写默认不接受 直接报错
        stripUnknown: true, // 接受后 直接删掉
        abortEarly: false // 默认是true，表示如果检测是发现有一个字段不符合要求就立马返回
    });
    // 检查新添加的课程是否已经存在数据库， 若已经存在，返回409
    const existCourse = await Course.findById(code).exec();
    if(existCourse) {
        return res.sendStatus(409); // duplicate course code
    }
    // 新添加的课程不存在，就创建新的课程
    const course = new Course({_id:code, name, description}).exec(); //此处existCourse是document， Course是model， 别写混
    // 为什么没写成 const course = new Course({req.body); 
    // 因为不想让别人篡改不能动的字段， 只提供需要添加修改的字段

   
    await course.save();
    return res.status(201).json(course); 
}

module.exports = {
    getAllCourses,
    getCourseById, 
    updateCourseById, 
    deleteCourseById, 
    createCourse
};


   // 在数据库取数据经常看到以下几种操作
   // await Course.find()或findById().exec()    async await写法 新项目很多这样写
   // Course.findById().then().catch()    promise写法 久一点的项目多见
   // Course.findById((result, error) => {})   callback的写法 老项目多见