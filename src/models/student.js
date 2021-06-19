const {Schema, model} = require('mongoose');
const Joi = require('joi');

// backend validation package: joi最流行, express validator
// frontend validation package: validator也可以用在后端
const schema = new Schema({
    firstName:{
        type: String, 
        required: true,
        trim: true,
        minlength: 2
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        validate: {
            validator:(email) =>{  //对用户传过来的email进行验证, 用joi语法
                // const validation = Joi.string().email().validate(email);
                // const {error} = validation;
                // if (error){
                //     return false;
                // } else {
                //     return true;
                // }
                // 简写成下面

                //如果error有值，则验证失败
                return !Joi.string().email().validate(email).error; 
            },
            msg: 'Invalid email format'
        }
    },
    courses:[{ type: String, ref:'Course'}] // link student and courses 把course添加到student里 同样要在course的model里添加student 此处的Course大小写要与注册Course model时一一对应 见models/course.js中的module.exports = model('Course', schema); 
});

module.exports = model('Student', schema);