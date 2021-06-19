const {Schema, model} = require('mongoose');

const schema = new Schema(
    {
    _id:{
        type: String, // 这里写成JS形式 type: 'string' 写成字符串也可以
        uppercase: true,
        alias: 'code' //一个副本？快捷方式
    },
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: 'This is a description.'
    },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],     
        // link student and course 把student添加到course里 同样要在student的model里添加course 此处的Student大小写要与注册Student model时一一对应 见models/student.js中的module.exports = model('Student', schema); 
        // 此处type为MongoDB的ObjectId类型 并不是JS自带的 是mongoDB独有的数据类型 
        // mongoose为了支持MongoDB 想要找到这个类型 就要写成Schema.Types.ObjectId 
        // 此处ref 的类型上 要根据reference collection 的类型来定 Student是ObjectId类型 此处也写ObjectId
    __v:{
        type: Number,
        select: false
    }
},{
    timestamps: true,
    toJSON:{
        virtuals : true
    },
    id: false
});
//virtual属性只存在于用mongoose取数据的时候， 在数据库里是不存在的

// schema.virtual('code').get (function(){    
//     return this._id;
// })
//对schema中_id添加虚拟字段code  // 实现同样配对__id和code 也可直接在model里加alias
//   此处没有写成arrow function
// 是因为里面的this想让它指向实际获取的document

// const courseModel = model('Course', schema);
// module.exports = courseModel;
// 简写为
module.exports = model('Course', schema); 
// 此处Course的C大写 代表model
// 存的时候 Course -> courses 转换成全部小写, 后面加复数
// 存入数据库里对应的 courses collection
// Course model 注册在了mongoose里面 如果之后想要使用到这个model 
// 方式一： 直接引用这个model 在models/course.js 导出了 在其他地方引入它
// 方式二： 在mongoose里通过Course名字找到
