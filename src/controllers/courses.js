const Course = require('../models/course');

async function getAllCourses(req, res){
    // db.collection.find() mongodb里这样写
   const courses = await Course.find().exec();
   return res.json(courses);
}

async function getCourseById(req, res){
    const {id} = req.params;
    const course = await Course.findById(id);
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
    );
    if (!course){
        return res.sendStatus(404);
    }
    return res.json(course);
}

async function deleteCourseById(req, res){
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course){
        return res.sendStatus(404);
    }
    return res.sendStatus(204);
    // return res.json(course);
}

async function createCourse(req, res){
    // validate data
    const{code, name, description} = req. body;
    const course = new Course({_id:code, name, description}); //此处course是document， Course是model， 别写混
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