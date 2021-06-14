require('dotenv').config();
const express = require('express');
require('express-async-errors');
const morgan = require('morgan'); // morgan是express默认的日志中间件
const cors = require('cors');


const router = require('./routes');  
const { connectToDB } = require('./utils/db');
const errorHandler = require('./middleware/errorHandler'); 

// 监听3000端口
const PORT = process.env.PORT || 3000; 
const app = express();

const morganLog = process.env.NODE_ENV === 'production' ? morgan('common') : morgan('dev');


app.use(morganLog);
app.use(cors());

app.use (express.json());
app.use('/api', router)
app.use(errorHandler);

// 监听之前尝试连接DB
connectToDB();

// 这里没用Winston 自己写代码要把Winston加上去 winston也是log用的 以前在prac项目里讲过？
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})

