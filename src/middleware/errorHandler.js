module.exports = (error, req, res, next) => {
    // res.json(error); // 在生产环境 不需要返回全部信息

    if(error.name === 'ValidationError') {
        if (process.env.NODE_ENV === 'production') {
            // 在生产环境 不需要返回全部信息 只需要把message部分提取出来返回就行 
            const {details} = error;
            // const errMsg = details.map(i => i.message); 能work 但和下面的写法有什么区别？
            const errMsg = details.map((i) => ({
                message: i.message
            }));
            return res.status(400).json(errMsg);
        } else {
            return res.status(400).json(error);
        }
    }

    // catch other errors
    // 写多个错误场景 见expressjs.com的error-handling

    // log 
    // 用Winston 发送到监控平台上 因为是比较重大的没抓取到的错误

    return res.status(500).send('something unexpected happened, please try again later'); // 最不想看到的500错误
};



// 普通的middleware只接受3个参数 req, res, next
// errorHandler可以多接收一个error，放最前面

// 固定的返回格式
// {
//     data:[],
//     error: ""
// }

// 比起 if(error.name === 'ValidationError') {} 更优雅的方式是
// if (error instance of CustomError) {}
// class CustomError extends Error {

// }