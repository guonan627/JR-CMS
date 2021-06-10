
const express = require('express');
const router = require('./routes');

// 监听3000端口
const PORT = process.env.PORT || 3000; 
const app = express();

app.use('/api', router)

// 这里没用Winston 自己写代码要把Winston加上去 winston是log用的 以前在prac项目里讲过？
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})

