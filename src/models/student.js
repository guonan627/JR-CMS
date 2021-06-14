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
    }
});

module.exports = model('Student', schema);