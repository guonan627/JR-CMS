const mongoose = require('mongoose');
// mongoose. connect ('mongodb://localhost:27017/JR-CMS'); 商业项目里不可能这么简单就连接到MongoDB
const { on } = require('../models/course');

// 封装到一个function里
exports.connectToDB = () => {
    const connectionString = process.env.CONNECTION_STRING;
    const db = mongoose.connection;
    // 状态监听 
    db.on('connected', () => {
        console.log(`DB connected with ${connectionString}`);
    });
    db.on('error', (error) => {
        console.log ('DB connection failed');
        console.log(error.message);
        process.exit(1); 
        // 三种常见关闭server：
        // 1.正常关闭
        // 2. 非正常关闭 
        // 3. 手动人为正常关闭  process.exit(0); 
        // 4. 手动人为非正常关闭 process.exit(1); 非0以外的数 都代表人为非正常
    });
    db.on('disconnected', () => {
        console.log('disconnected');
    });
    //环境变量
    mongoose.connect(connectionString, {
        useNewUrlParser: true, // 去掉warning信息， MongoDB需要保证新版本能兼容旧版本，在参数配置上建议用新版本的
        useUnifiedTopology: true, // 去掉warning信息
    }); 
};


//const connectToDB = () => {};
// module.exports = {connectToDB}; 
